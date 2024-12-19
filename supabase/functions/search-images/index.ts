import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/images/search'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting search-images function')
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // First, try to get the API key from the apikeys table
    console.log('Checking apikeys table for Bing API key')
    const { data: apiKeyData, error: apiKeyError } = await supabaseClient
      .from('apikeys')
      .select('apikey')
      .eq('provider', 'bing')
      .single()

    let bingApiKey = ''

    if (apiKeyError || !apiKeyData) {
      console.log('No API key found in apikeys table, falling back to vault')
      // If not found in apikeys table, try to get it from the vault
      const { data: secretData, error: secretError } = await supabaseClient.rpc('get_secret', {
        secret_name: 'BING_API_KEY',
      })

      if (secretError) {
        console.error('Error getting Bing API key:', secretError)
        throw new Error('Failed to retrieve Bing API key')
      }

      if (!secretData || !secretData.trim()) {
        console.error('No valid Bing API key found in vault')
        throw new Error('No valid Bing API key found')
      }

      bingApiKey = secretData
      console.log('Successfully retrieved Bing API key from vault')
    } else {
      bingApiKey = apiKeyData.apikey
      console.log('Successfully retrieved Bing API key from apikeys table')
    }

    const { query, website, count = 5 } = await req.json()
    console.log('Request parameters:', { query, website, count })

    if (!query) {
      return new Response(
        JSON.stringify({
          error: 'Query parameter is required',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Simplification de la construction de la requête
    let searchQuery = query
    if (website) {
      // On ajoute simplement le nom du site à la recherche sans utiliser site:
      searchQuery = `${query} "${website}"`
      console.log('Search query with website:', searchQuery)
    }

    const searchUrl = `${BING_ENDPOINT}?q=${encodeURIComponent(searchQuery)}&count=${count}&safeSearch=Strict`
    console.log('Making request to Bing API:', searchUrl)

    const response = await fetch(searchUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': bingApiKey,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Bing API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Bing API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('Received response from Bing API:', {
      totalEstimatedMatches: data.totalEstimatedMatches,
      resultCount: data.value?.length
    })

    if (!data.value || !Array.isArray(data.value)) {
      console.error('Invalid response format from Bing API:', data)
      throw new Error('Invalid response format from Bing API')
    }

    const photos = data.value.map((image: any) => ({
      url: image.contentUrl,
      width: image.width,
      height: image.height,
      contentSize: image.contentSize,
    }))

    console.log(`Successfully processed ${photos.length} images`)

    return new Response(
      JSON.stringify({
        photos,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in search-images function:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
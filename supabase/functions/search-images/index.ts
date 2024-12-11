import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/images/search'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer la clé Bing depuis la table apikeys
    const { data: apiKeys, error: apiKeyError } = await supabaseClient
      .from('apikeys')
      .select('apikey')
      .eq('provider', 'bingkey1')
      .limit(1)
      .single()

    if (apiKeyError || !apiKeys?.apikey) {
      console.error('API Key Error:', apiKeyError)
      throw new Error('Failed to retrieve Bing API key')
    }

    const { query, website, count = 5 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Construire la requête avec site: si un site web est fourni
    const searchQuery = website ? `site:${website} ${query}` : query
    console.log('Searching images with query:', searchQuery)
    
    const searchUrl = `${BING_ENDPOINT}?q=${encodeURIComponent(searchQuery)}&count=${count}&safeSearch=Strict`

    const response = await fetch(searchUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKeys.apikey,
      },
    })

    if (!response.ok) {
      console.error('Bing API Error:', response.status, await response.text())
      throw new Error(`Bing API responded with status ${response.status}`)
    }

    const data = await response.json()
    const photos = data.value.map((item: any) => ({
      url: item.contentUrl,
      width: item.width,
      height: item.height,
      contentSize: item.contentSize || 'Unknown size'
    }))

    console.log('Successfully retrieved', photos.length, 'photos')
    return new Response(
      JSON.stringify({ photos }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in search-images function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
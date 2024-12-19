import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/images/search'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get API key from vault
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    const { data: secretData, error: secretError } = await supabaseClient.rpc('get_secret', {
      secret_name: 'BING_API_KEY',
    })

    if (secretError || !secretData) {
      console.error('Error getting Bing API key:', secretError)
      throw new Error('Failed to retrieve Bing API key')
    }

    const { query, website, count = 5 } = await req.json()

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

    let searchQuery = query;
    
    // Si un site web est fourni, on l'ajoute à la requête
    if (website) {
      try {
        const url = new URL(website);
        const domain = url.hostname;
        // Combine le site avec la requête originale
        searchQuery = `${query} site:${domain}`;
        console.log('Recherche combinée:', searchQuery);
      } catch (error) {
        console.error('Erreur lors du parsing de l\'URL:', error);
        // On garde la requête originale si l'URL n'est pas valide
      }
    }

    console.log('Recherche d\'images avec la requête:', searchQuery);
    
    const searchUrl = `${BING_ENDPOINT}?q=${encodeURIComponent(searchQuery)}&count=${count}&safeSearch=Strict`

    const response = await fetch(searchUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': secretData,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erreur API Bing:', data)
      throw new Error('Impossible de récupérer les images depuis Bing')
    }

    const photos = data.value.map((image: any) => ({
      url: image.contentUrl,
      width: image.width,
      height: image.height,
      contentSize: image.contentSize,
    }))

    return new Response(
      JSON.stringify({
        photos,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/images/search'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== Début de la fonction search-images ===')
    
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
    console.log('Vérification de la clé API Bing dans la table apikeys')
    const { data: apiKeyData, error: apiKeyError } = await supabaseClient
      .from('apikeys')
      .select('apikey')
      .eq('provider', 'bingkey1')
      .single()

    let bingApiKey = ''

    if (apiKeyError || !apiKeyData) {
      console.log('Pas de clé API trouvée pour bingkey1, essai avec bingkey2')
      // Try bingkey2 if bingkey1 fails
      const { data: apiKey2Data, error: apiKey2Error } = await supabaseClient
        .from('apikeys')
        .select('apikey')
        .eq('provider', 'bingkey2')
        .single()

      if (apiKey2Error || !apiKey2Data) {
        console.log('Pas de clé API trouvée dans la table apikeys, utilisation du vault')
        // If not found in apikeys table, try to get it from the vault
        const { data: secretData, error: secretError } = await supabaseClient.rpc('get_secret', {
          secret_name: 'BING_API_KEY',
        })

        if (secretError) {
          console.error('Erreur lors de la récupération de la clé API Bing:', secretError)
          throw new Error('Impossible de récupérer la clé API Bing')
        }

        if (!secretData || !secretData.trim()) {
          console.error('Aucune clé API Bing valide trouvée dans le vault')
          throw new Error('Aucune clé API Bing valide trouvée')
        }

        bingApiKey = secretData
        console.log('Clé API Bing récupérée avec succès depuis le vault')
      } else {
        bingApiKey = apiKey2Data.apikey
        console.log('Clé API Bing récupérée avec succès depuis bingkey2')
      }
    } else {
      bingApiKey = apiKeyData.apikey
      console.log('Clé API Bing récupérée avec succès depuis bingkey1')
    }

    const { query, website, count = 5 } = await req.json()
    console.log('Paramètres de la requête reçus:', { query, website, count })

    if (!query) {
      console.error('Erreur: paramètre query manquant')
      return new Response(
        JSON.stringify({
          error: 'Le paramètre query est requis',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    let searchQuery = query
    if (website) {
      searchQuery = `${query} "${website}"`
      console.log('Requête de recherche avec site web:', searchQuery)
    }

    const searchUrl = `${BING_ENDPOINT}?q=${encodeURIComponent(searchQuery)}&count=${count}&safeSearch=Strict`
    console.log('URL de la requête Bing:', searchUrl)

    console.log('Envoi de la requête à l\'API Bing...')
    const response = await fetch(searchUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': bingApiKey,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API Bing:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`L'API Bing a retourné ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('Réponse reçue de l\'API Bing:', {
      totalEstimatedMatches: data.totalEstimatedMatches,
      resultCount: data.value?.length
    })

    if (!data.value || !Array.isArray(data.value)) {
      console.error('Format de réponse invalide de l\'API Bing:', data)
      throw new Error('Format de réponse invalide de l\'API Bing')
    }

    const photos = data.value.map((image: any) => ({
      url: image.contentUrl,
      width: image.width,
      height: image.height,
      contentSize: image.contentSize,
    }))

    console.log(`Traitement réussi de ${photos.length} images`)
    console.log('=== Fin de la fonction search-images ===')

    return new Response(
      JSON.stringify({
        photos,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Erreur dans la fonction search-images:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Une erreur inattendue est survenue',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
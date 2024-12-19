import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/images/search'

console.log("=== Edge Function search-images loaded ===");

Deno.serve(async (req) => {
  // Add timestamp to each log entry for better tracking
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] New request received`);
  console.log(`[${timestamp}] Request method:`, req.method);
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log(`[${timestamp}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log(`[${timestamp}] Starting search-images function execution`);
    
    // Create Supabase client
    console.log(`[${timestamp}] Creating Supabase client...`);
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )
    console.log(`[${timestamp}] Supabase client created successfully`);

    // First, try to get the API key from the apikeys table
    console.log(`[${timestamp}] Checking apikeys table for Bing API key (bingkey1)`);
    const { data: apiKeyData, error: apiKeyError } = await supabaseClient
      .from('apikeys')
      .select('apikey')
      .eq('provider', 'bingkey1')
      .single()

    let bingApiKey = ''

    if (apiKeyError || !apiKeyData) {
      console.log(`[${timestamp}] No API key found for bingkey1, trying bingkey2`);
      // Try bingkey2 if bingkey1 fails
      const { data: apiKey2Data, error: apiKey2Error } = await supabaseClient
        .from('apikeys')
        .select('apikey')
        .eq('provider', 'bingkey2')
        .single()

      if (apiKey2Error || !apiKey2Data) {
        console.log(`[${timestamp}] No API key found in apikeys table, trying vault`);
        // If not found in apikeys table, try to get it from the vault
        const { data: secretData, error: secretError } = await supabaseClient.rpc('get_secret', {
          secret_name: 'BING_API_KEY',
        })

        if (secretError) {
          console.error(`[${timestamp}] Error retrieving Bing API key:`, secretError);
          throw new Error('Unable to retrieve Bing API key')
        }

        if (!secretData || !secretData.trim()) {
          console.error(`[${timestamp}] No valid Bing API key found in vault`);
          throw new Error('No valid Bing API key found')
        }

        bingApiKey = secretData
        console.log(`[${timestamp}] Successfully retrieved Bing API key from vault`);
      } else {
        bingApiKey = apiKey2Data.apikey
        console.log(`[${timestamp}] Successfully retrieved Bing API key from bingkey2`);
      }
    } else {
      bingApiKey = apiKeyData.apikey
      console.log(`[${timestamp}] Successfully retrieved Bing API key from bingkey1`);
    }

    console.log(`[${timestamp}] Parsing request body...`);
    const requestBody = await req.json();
    console.log(`[${timestamp}] Request body:`, JSON.stringify(requestBody, null, 2));

    const { query, website, count = 5 } = requestBody;
    console.log(`[${timestamp}] Request parameters:`, { query, website, count });

    if (!query) {
      console.error(`[${timestamp}] Error: missing query parameter`);
      return new Response(
        JSON.stringify({
          error: 'The query parameter is required',
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
      console.log(`[${timestamp}] Search query with website:`, searchQuery);
    }

    const searchUrl = `${BING_ENDPOINT}?q=${encodeURIComponent(searchQuery)}&count=${count}&safeSearch=Strict`
    console.log(`[${timestamp}] Bing API request URL:`, searchUrl);

    console.log(`[${timestamp}] Sending request to Bing API...`);
    const response = await fetch(searchUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': bingApiKey,
      },
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${timestamp}] Bing API error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Bing API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[${timestamp}] Received response from Bing API:`, {
      totalEstimatedMatches: data.totalEstimatedMatches,
      resultCount: data.value?.length
    });

    if (!data.value || !Array.isArray(data.value)) {
      console.error(`[${timestamp}] Invalid response format from Bing API:`, data);
      throw new Error('Invalid response format from Bing API');
    }

    const photos = data.value.map((image: any) => ({
      url: image.contentUrl,
      width: image.width,
      height: image.height,
      contentSize: image.contentSize,
    }));

    console.log(`[${timestamp}] Successfully processed ${photos.length} images`);
    console.log(`[${timestamp}] === End of search-images function ===`);

    return new Response(
      JSON.stringify({
        photos,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error in search-images function:`, error);
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
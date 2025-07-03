import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: any[];
  abilities: any[];
  stats: any[];
  sprites: any;
  species?: { url: string };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request parameters
    const { start = 1, end = 100 } = await req.json()

    console.log(`Importing Pokemon ${start} to ${end}`)

    // Fetch Pokemon data from PokeAPI
    const pokemonPromises = []
    for (let i = start; i <= end; i++) {
      pokemonPromises.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching Pokemon ${i}:`, err)
            return null
          })
      )
    }

    const pokemonData = await Promise.all(pokemonPromises)
    const validPokemon = pokemonData.filter(p => p !== null) as Pokemon[]

    console.log(`Fetched ${validPokemon.length} Pokemon from API`)

    // Prepare data for database insertion
    const pokemonForDB = validPokemon.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types,
      abilities: pokemon.abilities,
      stats: pokemon.stats,
      sprites: pokemon.sprites,
      species_url: pokemon.species?.url || null,
      is_active: true
    }))

    // Insert into database
    const { data, error } = await supabaseClient
      .from('external_pokemon')
      .upsert(pokemonForDB, { onConflict: 'id' })

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log(`Successfully imported ${pokemonForDB.length} Pokemon`)

    return new Response(
      JSON.stringify({
        success: true,
        imported: pokemonForDB.length,
        message: `Successfully imported Pokemon ${start} to ${end}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
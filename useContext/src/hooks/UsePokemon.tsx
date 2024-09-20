import { useMemo, useCallback, createContext, useContext, useEffect, useReducer } from "react";

interface PokemonProps {
    id: Number 
    name: String 
    type:String[] 
    hp: Number
    attack:Number,
    defense:Number,
    special_attack:Number,
    special_defense:Number,
    speed:Number 
}

"23/08/74/"

function PokemonSource (): {pokemon: PokemonProps[], search:string, setSearch: (search: string) => void} {


        type PokemonState = {
            pokemon: PokemonProps[] 
            search: string 
        }

        type PokemonAction = { type: "setPokemon", payload: PokemonProps[] } | {type: "setSearch", payload: string } 

        const [{pokemon, search}, dispatch] = useReducer((state: PokemonState, action: PokemonAction) => {
            switch(action.type) {
                case "setPokemon": 
                    return {...state, pokemon: action.payload} 

                case "setSearch": 
                    return {...state, search: action.payload}
            }
        }, {
            pokemon: [], 
            search: ""
        })

    useEffect(() => {
        fetch('/pokemon.json') 
            .then((response) => response.json())
            .then((data) => dispatch({type:"setPokemon", payload:data}))
    }, [])

    const setSearch = useCallback((search: string) => {
        dispatch({
            type:"setSearch", 
            payload: search
        })
    }, [])

    const filteredPokemon = useMemo(() => pokemon.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [pokemon, search]).slice(0, 20) 
    
    const sortedPokemon = useMemo(() => [...filteredPokemon].sort((a, b) => a.name.toString().localeCompare(b.name.toString())), [filteredPokemon]) // asl what does a, b mean and what they hold

    return {pokemon: sortedPokemon, search, setSearch} 
}

const PokemonContext = createContext <ReturnType <typeof PokemonSource> | undefined> ({} as any as ReturnType< typeof PokemonSource >) 

export function usePokemonContext () {
    return useContext(PokemonContext) 
}

export function PokemonProvider ({children}: {children: React.ReactNode}) {
   return ( 
    <PokemonContext.Provider value={PokemonSource()}> 
        {children} 
    </PokemonContext.Provider>
    )
}


import { useReducer, createContext, useContext, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"


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

function PokemonSource (): {pokemon: PokemonProps[], search: string, setSearch: (search: string) => void} {
    
    let {data: pokemon} =useQuery<PokemonProps[]|undefined>({queryKey: ["pokemon"], queryFn: () => fetch("/pokemon.json").then(response => response.json())}) 


    type PokemonStateType = {
        search: string 
    }

    type PokemonActionType = {
        type: "searchPokemon", 
        search:string,  
    }

    const [{search}, dispatch] = useReducer((state: PokemonStateType, action: PokemonActionType) => {

        switch(action.type) {
            case "searchPokemon":
                return {...state, search: action.search}
        }

    }, {
        search: ""       
    })



    const setSearch = useCallback((search: string) => {
        dispatch({type: "searchPokemon", search})
    }, [search])


    pokemon = pokemon ?? [];
    const filteredPokemon = useMemo(() => pokemon.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [pokemon, search]).slice(0, 20) 
    
    const sortedPokemon = useMemo(() => [...filteredPokemon].sort((a, b) => a.name.toString().localeCompare(b.name.toString())), [filteredPokemon])

    return {pokemon: sortedPokemon, search, setSearch}
}

const PokemonContext = createContext <ReturnType <typeof PokemonSource> | undefined> ({} as any as ReturnType <typeof PokemonSource>)

export function usePokemonContext () {
    return useContext(PokemonContext) 
}

export const PokemonContextProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <PokemonContext.Provider value={PokemonSource()}>
            {children}
        </PokemonContext.Provider>
    )
}
import { useReducer, useEffect, createContext, useContext, useCallback, useMemo } from "react"

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
    type PokemonStateType = {
        pokemon: PokemonProps[], 
        search: string 
    }

    type PokemonActionType = | 
    {
        type: "setPokemon", 
        payload: PokemonProps[] 
    } 
    | 
    
    {
        type: "searchPokemon", 
        search:string,  
    }

    const [{pokemon, search}, dispatch] = useReducer((state: PokemonStateType, action: PokemonActionType) => {

        switch(action.type) {
            case "setPokemon": 
                return {...state, pokemon: action.payload}
        
            case "searchPokemon":
                return {...state, search: action.search}
        }

    }, {
        pokemon: [],
        search: ""       
    })

    useEffect(() => {
        fetch("/pokemon.json")
            .then((response) => response.json())
            .then((data) => dispatch({ type: "setPokemon", payload:data}))
    }, [])


    const setSearch = useCallback((search: string) => {
        console.log(search)
        dispatch({type: "searchPokemon", search})
    }, [search])


    const filteredPokemon = useMemo(() =>  pokemon.filter((po) => po.name.toLowerCase().includes(search.toLowerCase())), [pokemon, search])
    const sortedPokemon = useMemo(() => [...filteredPokemon].sort((a, b) => a.name.toString().localeCompare(b.name.toString())), [pokemon, search])

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
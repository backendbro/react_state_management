import {usePokemonContext, PokemonContextProvider} from "../src/hooks/UsePokemonDub"
import "./index.css"

function SearchBox () {
    const pokemon = usePokemonContext() 
    const search = pokemon?.search

    return (
    <>
      <input 
        type='text' 
        className= "mt-3 block w-full rounded-md border border-gray-300 shadow-sm"
        placeholder='Search' 
        onChange={(e) => pokemon?.setSearch(e.target.value)}
      />
    </>
  )
}

function PokemonList () {
  const pokemon = usePokemonContext() 
  
  return (
    <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3'> 
        {pokemon?.pokemon.map((poke) => (
          <div key={String(poke.id)}> {poke.name} </div>
        ))}
      
    </ul>
  )
}

function App() {
  return (
    <>
    <div className="mx-auto max-w-3xl">
      <PokemonContextProvider>
          <SearchBox />
          <PokemonList />    
      </PokemonContextProvider>
      </div>
    </>
  )
}

export default App

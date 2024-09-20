import {usePokemonContext, PokemonContextProvider} from "../src/hooks/UsePokemonDub"
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
import { Link, Outlet, ReactLocation, Router, useMatch } from "@tanstack/react-location"

const queryClient = new QueryClient()
const location = new ReactLocation()

function SearchBox () {
    const pokemon = usePokemonContext() 

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
          <Link 
            key={String(poke.id)}
            to ={`/pokemon/${poke.id}`}
            
            >
            <div key={String(poke.id)}> {poke.name} </div>
          </Link>
        ))}
      
    </ul>
  )
}

function PokemonDetail () {
  const {params: {id}} = useMatch()
  const pokemon = usePokemonContext() 
  
  const pokemonData = pokemon?.pokemon.find((p) => p.id === +id)
  if (!pokemonData) {
    return (
      <div>No Pokemon Data</div> 
    )
  }
  
  return (
    <>
      <div> 
        {JSON.stringify(pokemonData)}
      </div>
    </>
  )
}

const routes = [

  {
    path:"/", 
    element: (
      <>
        <SearchBox />
        <PokemonList />
      </>
    )
  }, 
  {
    path:"/pokemon/:id", 
    element: (
      <>
        <PokemonDetail />
      </>
    )
  } 

]

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <PokemonContextProvider>
          <Router location={location} routes={routes}>
          <div className="mx-auto max-w-3xl">
            <Outlet />   
          </div>
          </Router>
      </PokemonContextProvider>
    </QueryClientProvider>
    </>
  )
}

export default App

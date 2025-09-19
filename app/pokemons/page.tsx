import dbConnect from "../lib/dbConnection";
import Pokemon from "../models/pokemon";
import PokemonTable from "./components/pokemonTable";

const getPokemons = async () => {
  await dbConnect();
  const pokemons = await Pokemon.find().select("-three_d");
  return pokemons || [];
};

export default async function AllPokemons() {
  const pokemons = await getPokemons();
  return (
    <div className="flex flex-col gap-2 items-center justify-center p-10">
      <div className="flex flex-col w-full">
        <PokemonTable
          pokemons={pokemons.map((p) => ({
            _id: p._id.toString(),
            name: p.name,
            rarity: p.rarity,
            image: p.image,
          }))}
        />
      </div>
    </div>
  );
}

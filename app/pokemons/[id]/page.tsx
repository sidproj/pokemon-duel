import dbConnect from "@/app/lib/dbConnection";
import Pokemon from "@/app/models/pokemon";
import SinglePokemonWrapper from "../components/SinglePokemonWrapper";

interface PageProps {
  params: { id: string };
}

const getSinglePokemon = async (id: String) => {
  await dbConnect();
  const pokemon = await Pokemon.findById(id);
  console.log();
  return pokemon;
};

export default async function PokemonPage({ params }: PageProps) {
  const { id } = await params;
  const pokemon = await getSinglePokemon(id);
  
  const p = {
    _id:pokemon._id.toString(),
    name:pokemon.name,
    image:pokemon.image,
    three_d:pokemon.three_d,
    rarity:pokemon.rarity
  }

  return (
    <SinglePokemonWrapper pokemon={p} />
  );
}

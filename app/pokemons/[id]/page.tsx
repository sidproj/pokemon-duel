import dbConnect from "@/app/lib/dbConnection";
import Pokemon from "@/app/models/pokemon";
import SinglePokemonWrapper from "../components/SinglePokemonWrapper";

interface PageProps {
  params: { id: string };
}

const getSinglePokemon = async (id: String) => {
  await dbConnect();
  const pokemonDoc = await Pokemon.findById(id);
  const pokemon = pokemonDoc?.toObject();
  return pokemon;
};

export default async function PokemonPage({ params }: PageProps) {
  const { id } = await params;
  const pokemon = await getSinglePokemon(id);

  const p: any = {
    _id: pokemon._id.toString(),
    name: pokemon.name,
    image: pokemon.image,
    three_d: pokemon.three_d,
    rarity: pokemon.rarity,
    steps: pokemon.steps,
    moves: pokemon.moves.map((move: any) => ({
      base_wheel_size: move.base_wheel_size,
      name: move.name,
      move_type: move.move_type,
      additional_notes: move.additional_notes,
      damage: move.damage,
    })),
  };

  return <SinglePokemonWrapper pokemon={p} />;
}

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";

// dynamically import the 3D Scene client component
const Scene = dynamic(() => import("@/app/components/ThreeD"), {
  ssr: false, // only render on client
  loading: () => <div>Loading 3D viewer...</div>, // fallback
});

interface Props {
  pokemon: any;
}

const SinglePokemonWrapper = (props: Props) => {
  const { pokemon } = props;

  return (
    <div className="flex flex-col gap-2">
      <h1>Pokemon name: {pokemon.name}</h1>
      <div>Rarity: {pokemon.rarity}</div>
      <div>
        <div>Image:</div>
        <Image
          src={pokemon.image}
          width={200}
          height={200}
          alt={pokemon.name}
        />
      </div>
    </div>
  );
};

export default SinglePokemonWrapper;

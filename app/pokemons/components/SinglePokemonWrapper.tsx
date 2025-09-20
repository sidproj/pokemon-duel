"use client";

import { Move } from "@/app/lib/types";
import { notification } from "antd";
import Image from "next/image";
import { useState } from "react";
import MoveInput from "./MoveInput";

interface Props {
  pokemon: any;
}

const SinglePokemonWrapper = (props: Props) => {
  const { pokemon } = props;
  const [steps, setSteps] = useState<number>(pokemon.steps);
  const [moves, setMoves] = useState<Move[]>(pokemon.moves || []);

  const handleSave = async () => {
    if (steps == 0 || moves.length == 0) {
      console.log("error");
    }
    const url = "/api/pokemons";
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ steps, moves,id:pokemon._id }),
    };

    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-[100px] overflow-y-auto">
      <div className="flex flex-col gap-2 w-full">
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
        <button
          className="bg-[#1a861a] text-white cursor-pointer rounded-lg w-fit px-2"
          onClick={handleSave}
        >
          Save
        </button>
        <input
          type="number"
          className="border-2 p-2 w-[200px]"
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value))}
        />

        <MoveInput moves={moves} setMoves={setMoves} />
      </div>
    </div>
  );
};

export default SinglePokemonWrapper;

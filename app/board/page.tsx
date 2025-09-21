"use client";
import { useState } from "react";
import Board from "./components/board";
import MoveWheel from "./components/moveWheel";
import { Pieces } from "../lib/types";

const BoardPage = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pieces | null>(null);
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      {selectedPokemon && <MoveWheel moves={selectedPokemon.moves} />}
      <Board setSelectedPokemon={setSelectedPokemon} />
    </div>
  );
};

export default BoardPage;

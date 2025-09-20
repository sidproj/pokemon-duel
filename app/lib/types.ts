export interface PokemonTableInterface {
  _id: string;
  name: string;
  rarity: string;
  image: string;
}

export interface BoardStructureInterface {
  [key: number]: {
    position: { x: number; y: number };
    connected: number[];
    type: "DOT" | "SPAWN" | "FLAG" | "BENCH";
  };
}

export interface Pieces {
  boardKey: number;
  onBoard: boolean;
  image: string;
  id: string;
  steps:number
}

export interface Move {
  base_wheel_size: number;
  name: string;
  move_type: "RED" | "WHITE" | "WHITE Z-MOVE" | "PURPLE Z-MOVE";
  additional_notes:string;
  damage:number;
}

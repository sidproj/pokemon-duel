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
  steps: number;
  moves:Move[];
}

export type AttackType = "RED" | "WHITE" | "PURPLE" | "BLUE";

export interface Move {
  attack_wheel_size: number;
  attack_name: string;
  attack_type: AttackType;
  attack_value: number;
  attack_ability: string;
  attack_start_angle_deg: number;
  attack_end_angle_deg: number;
  attack_wheel_file_name: string;
}

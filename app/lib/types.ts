export interface PokemonTableInterface {
  _id: string;
  name: string;
  rarity: string;
  image: string;
}

export interface BoardStructureInterface {
  [key: number]: { 
    position: { x: number; y: number },
    connected: number[],
    type:"DOT" | "SPAWN" | "FLAG" | "BENCH"
  }
}

export interface Pieces{
    boardKey:number,
    onBoard:boolean,
    image:string,
    id:string;
}
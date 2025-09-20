import dbConnect from "@/app/lib/dbConnection";
import Pokemon from "@/app/models/pokemon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const pokemons = await Pokemon.find().limit(12);
    return NextResponse.json(pokemons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}

export async function POST(request:NextRequest){
  try{
    const data = await request.json();
    if(!data.id){
      throw Error("No id found");
    }

    const pokemon = await Pokemon.findById(data.id);
    pokemon.moves = data.moves;
    pokemon.steps = data.steps;

    await pokemon.save();
    return NextResponse.json(pokemon);

  }catch(error:any){
    console.log(error);
    return NextResponse.json({error:error.message})
  }
}
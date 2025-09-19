import dbConnect from "@/app/lib/dbConnection";
import Pokemon from "@/app/models/pokemon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const pokemons = await Pokemon.find().limit(2);
    return NextResponse.json(pokemons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}

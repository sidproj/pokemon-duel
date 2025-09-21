import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dbConnect from "@/app/lib/dbConnection";
import Pokemon from "@/app/models/pokemon";

const rootDir = "D:/Pokemon_Duel/Assets/Pokemon_Data";

function parseAttackValue(value: string, type: string): number {
  if (type.toUpperCase() === "PURPLE") {
    return (value.match(/☆/g) || []).length;
  }
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
}

function parsePokemonNames(name:string){
    return name
    .replace(/-m/gi, "♂")
    .replace(/-/g, " ");
}

function parseFolderName(folderName: string) {
  const parts = folderName.split("_");
  if (parts.length < 2) {
    return { name: folderName, rarity: null };
  }

  const rarity = parts[parts.length - 2];
  const name = parts.slice(0, parts.length - 2).join("_");

  return { name, rarity };
}

export async function GET() {
  try {
    await dbConnect();

    const folders = fs
      .readdirSync(rootDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const results: any[] = [];

    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];
      const jsonFile = path.join(rootDir, folder, `${folder}_attack_JSON.json`);
      if (!fs.existsSync(jsonFile)) {
        results.push({ folder, jsonFile, status: "json_not_found" });
        continue;
      }

      try {
        const { name, rarity } = parseFolderName(folder);

        const pokemon = await Pokemon.findOne({
          name: { $regex: new RegExp(`^${parsePokemonNames(name)}$`, "i") },
          rarity: rarity,
        });

        const data = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

        pokemon.steps = data.base_movement_points;
        pokemon.moves = data.attack_lists_by_type.basic.map((m: any) => {
          return {
            ...m,
            attack_value: parseAttackValue(m.attack_value, m.attack_type),
            attack_type: m.attack_type.toUpperCase()
          };
        });

        await pokemon.save();

        console.log(
          `Completed ${i} / 155 | Pokemon name: ${pokemon.name} rarity: ${pokemon.rarity}`
        );

        results.push({ folder, pokemon });
      } catch (err: any) {
        
        console.log(
          `Error ${i} / 155`
        );
        results.push({ folder, status: "error", message: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      length: results.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

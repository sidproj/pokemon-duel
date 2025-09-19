import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import Pokemon from "@/app/models/pokemon";
import { uploadFile } from "@/app/services/admin/cloudinaryUpload";
import dbConnect from "@/app/lib/dbConnection";

const uploadPokemon = async (data: {name:string,rarity:string, three_d: string; image: string },index:number,length:number) => {
  const imageFilePath = path.join(
    process.cwd(),
    "public",
    "Pokemon Duel",
    data.image
  );

  const imageFile = await uploadFile(imageFilePath,"pokemon");

  const three_dFilePath = path.join(
    process.cwd(),
    "public",
    "Pokemon Duel",
    data.three_d
  );
  const three_dFile = await uploadFile(three_dFilePath,"pokemon");

  const pokemon = new Pokemon({
    name:data.name,
    rarity:data.rarity,
    image:imageFile.url,
    three_d:three_dFile.url,
  });

  await pokemon.save();
  console.log(`Uploaded ${index}/${length} - pokemon: ${data.name} - ${data.rarity}`);

};

export async function GET(request: NextRequest) {
  const modelsDir = path.join(process.cwd(), "public", "Pokemon Duel");
  try {
    await dbConnect();

    const files = fs.readdirSync(modelsDir); // read all files

    const map: { [key: string]: { three_d: string; image: string } } = {};

    files.forEach((file) => {
      const pokemon = file.split(" - ")[1];
      const rarity = file.split(" - ")[2].split(".")[0].split("_")[1];
      const new_name = pokemon + "." + rarity;
      if (!map[new_name]) {
        map[new_name] = { three_d: "", image: "" };
      }

      if (file.split(" - ")[2].split(".")[1] == "png") {
        map[new_name] = { ...map[new_name], image: file };
      } else {
        map[new_name] = { ...map[new_name], three_d: file };
      }
    });

    const keys = Object.keys(map)

    for(let i=0;i<keys.length;i++){
      const key = keys[i];
      const name = key.split(".")[0];
      const rarity = key.split(".")[1];
      await uploadPokemon({...map[key],name,rarity},i,keys.length);
    }

    return NextResponse.json({ count: files.length / 2 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to read directory", details: err.message },
      { status: 500 }
    );
  }
}

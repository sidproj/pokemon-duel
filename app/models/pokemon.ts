import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  rarity:{
    type:String,
    enum:["UX","EX","R","UC","C"],
    required:true,
  },
  three_d:{
    type:String,
    require:true,
  },
  image:{
    type:String,
    required:true,
  }
});


// ✅ Compound unique index (name + rarity must be unique together)
pokemonSchema.index({ name: 1, rarity: 1 }, { unique: true });

const Pokemon = mongoose.models.Pokemon || mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;
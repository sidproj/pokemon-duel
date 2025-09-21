import mongoose, { Schema } from "mongoose";
import { Move } from "../lib/types";

const moveSchema = new Schema<Move>({
  attack_wheel_size: { type: Number, required: true },
  attack_name: { type: String, required: true },
  attack_type: {
    type: String,
    enum: ["RED", "WHITE", "PURPLE", "BLUE", "GOLD"],
    required: true,
  },
  attack_value: { type: Number },
  attack_ability: { type: String },
  attack_start_angle_deg: { type: Number, required: true },
  attack_end_angle_deg: { type: Number, required: true },
});

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rarity: {
    type: String,
    enum: ["UX", "EX", "R", "UC", "C"],
    required: true,
  },
  three_d: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    required: true,
  },
  steps: { type: Number, default: 0 },
  moves: { type: [moveSchema], default: [] },
});

pokemonSchema.index({ name: 1, rarity: 1 }, { unique: true });

const Pokemon =
  mongoose.models.Pokemon || mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;

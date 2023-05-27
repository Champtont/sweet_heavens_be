import mongoose from "mongoose";

const { Schema, model } = mongoose;

const itemSchema = new Schema({
  categoryTags: [{ type: Object, required: true }],
  title: { type: String, required: true },
  photo: {
    type: String,
    required: false,
    default: "https://cdn-icons-png.flaticon.com/512/135/135161.png",
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export default model("Item", itemSchema);

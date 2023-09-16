import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2"

const productsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        default: [],
    },
    code: {
        type: Number,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: true,
    },
    category: {
        type: String,
        required: true,
    },
});

//implementando paginate en el Schema
productsSchema.plugin(paginate)

export const ProductsModel = model("products", productsSchema);
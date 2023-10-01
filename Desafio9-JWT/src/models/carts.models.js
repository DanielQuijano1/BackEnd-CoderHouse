import { Schema, model } from "mongoose";

const cartsSchema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "products",
                    //required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        default: [],
    },
});



cartsSchema.pre("findOne", function () {
    this.populate("products.product");
});


export const cartsModel = model("carts", cartsSchema);
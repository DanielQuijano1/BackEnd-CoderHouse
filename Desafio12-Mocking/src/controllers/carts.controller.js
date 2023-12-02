import { cartsModel } from "../models/carts.models.js";
import { ProductsModel } from "../models/products.models.js";

export default class CartController {
    constructor() { }

    async getProductInCartById(req, res) {
        const { cartId } = req.params;
        try {
            const products = await cartsModel.findById(cartId);

            if (products)
                res.status(200).send({
                    message: `Products in the cart ${cartId}`,
                    products,
                });
            else
                res.status(404).send({
                    message: `'product not found in cart'`,
                });
        } catch (error) {
            res.status(400).send({
                message: "error getting products",
                error,
            });
        }
    }

    async addProductInCartById(req, res) {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await cartsModel.findById(cartId);
            if (cart) {
                const prod = await ProductsModel.findById(productId);
                if (prod) {
                    const index = cart.products.findIndex(
                        //(item) => item.product == productId
                        (item) => item.product._id.toString() === productId
                    );
                    if (index != -1) {
                        cart.products[index].quantity = quantity;
                    } else {
                        cart.products.push({ product: productId, quantity: quantity });
                    }
                    const updateCart = await cartsModel.findByIdAndUpdate(cartId, cart);
                    res.status(200).send({
                        message: "the cart was uploaded successfully",
                        updateCart,
                    });
                } else {
                    res.status(404).send({
                        message: "product not found",
                    });
                }
            } else {
                res.status(404).send({ message: "cart not found" });
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: carts.controller.js:60 ~ CartController ~ addProductInCartById ~ error:",
                error
            );
            res.status(400).send({
                message: "error updating cart",
                error,
            });
        }
    }

    async delProductsInCartById(req, res) {
        const { cartId } = req.params;
        try {
            const cart = await cartsModel.findById(cartId);
            if (cart) {
                cart.products = [];
                await cart.save();
                res.status(200).send({
                    message: `the products in the cart ${cartId} were successfully deleted`,
                });
            } else {
                res.status(404).send({
                    message: `can't find cart`,
                });
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: carts.routes.js:86 ~ cartsRoutes ~ this.router.delete ~ error:",
                error
            );
            res.status(400).send({
                message: "error deleting product",
                error,
            });
        }
    }

    async delProductsByIdInCartById(req, res) {
        const { cartId, productId } = req.params;
        try {
            const cart = await cartsModel.findById(cartId);
            if (cart) {
                const index = cart.products.findIndex(
                    (item) => item.product._id.toString() == productId
                );
                if (index != -1) {
                    const newCart = cart.products.splice(index, 1);
                    await cart.save();
                    res.status(200).send({
                        message: `the product ${productId} in the cart ${cartId} were successfully deleted`,
                        products: newCart,
                    });
                } else {
                    res.status(404).send({
                        message: `product with id ${productId} not found in cart`,
                    });
                }
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: carts.controller.js:113 ~ CartController ~ delProductsByIdInCartById ~ error:",
                error
            );
            res.status(400).send({
                message: "error deleting product",
                error,
            });
        }
    }

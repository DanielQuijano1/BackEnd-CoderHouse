import { Router } from "express";
import { cartsModel } from "../models/carts.models.js";
import CartsManager from "../managers/cartsManager.js";

class cartsRoutes {
    path = "/carts";
    router = Router();
    cartsManager;

    constructor() {
        this.initCartsRoutes();
        this.cartsManager = new CartsManager()
    }

    initCartsRoutes() {
        //crea un carrito vacío
        this.router.post(`${this.path}`, async (req, res) => {
            try {
                const cart = await cartsModel.create({});
                res.status(200).send({
                    message: `cart created succesfully`,
                    cart,
                });
            } catch (error) {
                console.log("🚀 ~ file: cartsRoutes ~ this.router.post ~ error:", error)
                res
                    .status(400)
                    .send({
                        message: "error creating product",
                        error,
                    });
            }
        });

        //Obtiene los productos del carrito indicado con el cartID
        this.router.get(`${this.path}/:cartId`, async (req, res) => {
            const { cartId } = req.params;
            try {
                const products = await this.cartsManager.getProductInCartById(cartId);
                if (products)
                    res.status(200).send({
                        message: `Products in the cart ${cartId}`,
                        products,
                    });
                else
                    res.status(404).send({
                        message: `product with id ${cartId} not found`,
                    });
            } catch (error) {
                console.log("🚀 ~ file: cartsRoutes ~ this.router.get ~ error:", error)
                res.status(400).send({
                    message: "error getting carts",
                    error,
                });
            }
        });

        //añade un producto asignado a un carrito designado
        this.router.post(`${this.path}/:cartId/products/:productId`, async (req, res) => {
            const { cartId, productId } = req.params
            const { quantity } = req.body
            try {
                const addProduct = await this.cartsManager.addProductInCartById(cartId, productId, quantity);
                res.status(200).send({
                    message: 'the cart was uploaded successfully',
                    product: addProduct
                })
            } catch (error) {
                console.log("🚀 ~ file: cartsRoutes ~ this.router.post ~ error:", error)
                res.status(400).send({
                    message: 'error updating cart',
                    error
                })
            }

        })

        //DELETE "/:cid" ==> elimina todos los productos del carrito seleccionado
        this.router.delete(`${this.path}/:cartId`, async (req, res) => {
            const { cartId } = req.params
            try {
                const deleteProducts = await this.cartsManager.delProductsInCartById(cartId);
                res.status(200).send({
                    message: `the products in the cart ${cartId} were successfully deleted`,
                    product: deleteProducts
                })
            } catch (error) {
                console.log("🚀 ~ file: cartsRoutes ~ this.router.delete ~ error:", error)
                res.status(400).send({
                    message: 'error deleting products',
                    error
                })
            }
        })

        // DELETE "/:cid/products/:pid"  ==> eliminará del carrito el producto seleccionado
        this.router.delete(`${this.path}/:cartId/products/:productId`, async (req, res) => {
            const { cartId, productId } = req.params
            try {
                const deleteProduct = await this.cartsManager.deletProdByIdInCartById(cartId, productId);
                res.status(200).send({
                    message: `the product ${productId} in the cart ${cartId} were successfully deleted`,
                    product: deleteProduct
                })
            } catch (error) {
                console.log("🚀 ~ file: cartsRoutes ~ this.router.delete ~ error:", error)
                res.status(400).send({
                    message: 'error deleting product',
                    error
                })
            }
        })



        // PUT "api/carts/:cid/products/:pid" ==> actualiza sólo la cantidad del producto pasado
        this.router.put(`${this.path}/:cartId/products/:productId`, async (req, res) => {
            const { cartId, productId } = req.params
            const { quantity } = req.body
            try {
                const result = await this.cartsManager.editQuantity(cartId, productId, quantity)
                res.status(200).send({
                    message: `the quantity was successfully updated`,
                    product: result
                })
            } catch (error) {
                console.log("🚀 ~ file: cartsRoutes ~ this.router.put ~ error:", error)

            }
        })

        // PUT "/:cid" ==> actualiza el carrito mediante un array

        this.router.put(`${this.path}/:cartId`, async (req, res) => {
            const { cartId } = req.params
            let arrayProducts = req.body
            try {
                let newListProducts = await this.cartsManager.insertArray(cartId, arrayProducts)
                res.status(200).send({
                    message: `the cart was successfully updated`,
                    products: newListProducts
                })
            } catch (error) {
                console.log("🚀 ~ file: cartsRoutes ~ this.router.put ~ error:", error)

            }
        })

    }
}




export default cartsRoutes;
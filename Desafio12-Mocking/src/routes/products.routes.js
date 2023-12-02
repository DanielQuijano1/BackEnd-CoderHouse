import { Router } from "express";
import ProductsManager from "../managers/productManager.js"



class productsRoutes {
    path = "/products";
    router = Router();
    productManager;

    constructor() {
        this.productManager = new ProductsManager()
        this.initProductRoutes();
    }
    initProductRoutes() {
        this.router.get(`${this.path}`, async (req, res) => {
            try {
                let { limit, page, sort, category, status } = req.query;

                const products = await this.productManager.getAllProducts(limit, page, sort, status, category);
                return res.status(200).send({
                    message: "Get all products successfully",
                    products,
                });
            } catch (error) {
                console.log("file: products.routes.js:33 ~ productsRoutes ~ this.router.get ~ error:", error)
                res.status(400).send({
                    message: "error getting products",
                    error: error,
                });
            }
        });


        this.router.get(`${this.path}/:productID`, async (req, res) => {
            const { productID } = req.params;
            try {
                const product = await this.productManager.getProductById(productID);
                if (product) {
                    res.status(200).send({
                        message: `get product info to id ${productID} successfully`,
                        product,
                    });
                } else {
                    res.status(404).send({
                        message: `product with id ${productID} not found`,
                    });
                }
            } catch (error) {
                console.log("file: products.routes.js:58 ~ productsRoutes ~ this.router.get ~ error:", error)

                res.status(400).send({
                    message: "error getting product",
                    error: error,
                });
            }
        });

        this.router.post(`${this.path}`, async (req, res) => {
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            try {
                const newProduct = await this.productManager.addProduct({
                    title, description, price, thumbnail, code, stock, category
                });
                if (!newProduct) {
                    res.status(400).send({
                        message: `the product whit code ${code} is alredy register`,
                    });
                } else
                    res.status(200).send({
                        message: "product loaded successfully",
                        product: newProduct,
                    })
            } catch (error) {
                console.log("file: products.routes.js:62 ~ productsRoutes ~ this.router.post ~ error:", error)
                res.status(400).send({
                    message: "error creating product",
                    error: error,
                });
            }
        });



        this.router.put(`${this.path}/:productID`, async (req, res) => {
            const { productID } = req.params;
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            try {
                let product = await this.productManager.updateProductById(productID, { title, description, price, thumbnail, code, stock, category });
                if (!product) {
                    res.status(404).send({
                        message: `product with id ${productID} not found`,
                    });
                } else {
                    res.status(200).send({
                        message: `updated product`,
                        product,
                    });
                }
            } catch (error) {
                console.log("file: products.routes.js:88 ~ productsRoutes ~ this.router.put ~ error:", error)
                res.status(400).send({
                    message: "error updating product",
                    error: error,
                });
            }
        });


        this.router.delete(`${this.path}/:productID`, async (req, res) => {
            const { productID } = req.params;
            try {
                // const product = await ProductsModel.findByIdAndDelete(productID);
                const product = await this.productManager.deleteProductById(productID)
                if (product) {
                    res.status(200).send({
                        message: `product whith id ${productID} removed successfully`,
                        product,
                    });
                } else {
                    res.status(404).send({
                        message: `product with id ${productID} not found`,
                    });
                }
            } catch (error) {
                res.status(400).send({
                    message: "error deleting product",
                    error,
                });
            }
        });
    }
}


export default productsRoutes
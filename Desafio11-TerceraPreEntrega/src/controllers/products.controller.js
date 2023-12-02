import { ProductsModel } from "../models/products.models.js";

export default class ProductController {
    constructor() { }

    async getProducts(req, res) {
        let { limit, page, sort, filter } = req.query;

        const pag = page ? page : 1;
        const lim = limit ? limit : 10;
        const order = sort == "up" ? 1 : -1;
        try {
            const products = await ProductsModel.paginate(
                { filter: filter },
                { limit: lim, page: pag, sort: { price: order } }
            );
            if (products) {
                return res.status(200).json({
                    message: "Get all products successfully",
                    products,
                });
            }
            res.status(404).json({
                message: "Products not found",
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: products.controller.js:25 ~ ProductController ~ getAllProducts ~ error:",
                error
            );
            res.status(500).send({
                message: "error getting products",
                error: error,
            });
        }
    }

    async getProductById(req, res) {
        const { productID } = req.params;
        try {
            const product = await ProductsModel.findById(productID);
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
            console.log(
                "🚀 ~ file: products.routes.js:58 ~ productsRoutes ~ this.router.get ~ error:",
                error
            );

            res.status(500).send({
                message: "error getting product",
                error: error,
            });
        }
    }

    async addProduct(req, res) {
        const { title, description, price, thumbnail, code, stock, category } =
            req.body;

        try {
            const product = await ProductsModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
            });
            if (product) {
                return res.status(201).send({
                    message: "product loaded successfully",
                    product: product,
                });
            }
            res.status(400).send({ message: "error creating product" });
        } catch (error) {
            if (error.code == 11000) {
                return res.status(400).send({
                    message: `the product whit code ${code} is alredy register`,
                });
            }
            res.status(500).send({
                message: "error creating product",
                error: error,
            });
        }
    }

    async updateProductById(req, res) {
        const { productID } = req.params;
        const {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
        } = req.body;

        try {
            const product = await ProductsModel.findByIdAndUpdate(productID, {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
            });
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
            console.log(
                "🚀 ~ file: products.routes.js:88 ~ productsRoutes ~ this.router.put ~ error:",
                error
            );
            res.status(400).send({
                message: "error updating product",
                error: error,
            });
        }
    }

    async deleteProductById(req, res) {
        const { productID } = req.params;
        try {
            const product = await ProductsModel.findByIdAndDelete(productID);
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
    }
}
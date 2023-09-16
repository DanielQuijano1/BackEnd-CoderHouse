import { ProductsModel } from "../models/products.models.js";


class ProductsManager {

    async getAllProducts(limit = 10, page = 1, sort = null, status, category) {
        let query;
        if (!status && !category) {
            query = {}
        } else if (status && !category) {
            query = { status: status }
        } else if (!status && category) {
            query = { category: category }
        } else {
            query = { category: category, status: status }
        }

        try {
            const allProducts = await ProductsModel.paginate(query, { limit: limit, page: page, sort: { price: sort } });
            return allProducts;
        } catch (error) {
            console.log("🚀 ~ file: productsManager ~ getAllProducts= ~ error:", error)

        }
    };

    async getProductById(productId) {
        try {
            const product = await ProductsModel.findById(productId)
            if (product)
                return product
            else
                return null;
        } catch (error) {
            console.log("🚀 ~ file: ProductsManager ~ getProductById ~ error:", error)

        }
    }


    async addProduct({ title, description, price, thumbnail, code, stock, status, category }) {
        try {
            const productDetails = await ProductsModel.findOne({
                code: code,
            });

            if (productDetails && Object.keys(productDetails).length !== 0) {
                return null;
            }
            const newProduct = await ProductsModel.create({ title, description, price, thumbnail, code, stock, status, category });
            return newProduct;
        } catch (error) {
            console.log("🚀 ~ file: ProductsManager ~ error:", error)

        }
    }


    async updateProductById(productID, { title, description, price, thumbnail, code, stock, status, category }) {
        try {
            let updateProduct = await ProductsModel.updateOne({ _id: productID }, { title, description, price, thumbnail, code, stock, status, category })
            return updateProduct;
        } catch (error) {
            console.log(
                "🚀 ~ file: ProductManager ~ updateProduct= ~ error:",
                error
            );
        }

    }

    async findAndDelete(e) {
        try {
            const result = await ProductsModel.findOneAndDelete(e)
            //.deleteOne({ _id: productId });
            return result;
        } catch (error) {
            console.log("🚀 ~ file: ProductsManager ~ findAndDelete ~ error:", error)

        }
    }

    async deleteProductById(productId) {
        try {
            const result = await ProductsModel.findByIdAndDelete(productId)
            //.deleteOne({ _id: productId });
            return result;
        } catch (error) {
            console.log(
                "🚀 ~ file: ProductManager ~ deleteProduct ~ error:",
                error
            );
        }
    }
}

export default ProductsManager
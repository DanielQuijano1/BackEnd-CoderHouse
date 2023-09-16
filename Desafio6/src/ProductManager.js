import { promises as fs } from "fs";
//const fs = require("fs");

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async generateIndex(listProducts) {
        try {
            if (listProducts.length === 0) return 1;
            return listProducts[listProducts.length - 1].id + 1;
        } catch (error) {
            console.log(
                "🚀 ~ file: ArmyManager ~ generateIndex ~ error",
                error
            );
        }
    }

    async addProducts({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id,
        status,
        category,
    }) {
        const listProducts = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const newId = await this.generateIndex(listProducts);
        id = newId;
        status = true;
        const verificarCode = listProducts.some((product) => {
            return product.code === code;
        });
        if (verificarCode) {
            return {
                message: "el valor del CODE ya se encuentra asignado a otro producto",
            };
        } else if (
            title != "" &&
            description != "" &&
            price != "" &&
            stock != "" &&
            title != undefined &&
            description != undefined &&
            price != undefined &&
            stock != undefined &&
            code != "" &&
            code != undefined &&
            category != "" &&
            category != undefined
        ) {
            try {
                // console.log("producto cargado correctamente");
                listProducts.push({
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category,
                    id,
                });

                await fs.writeFile(this.path, JSON.stringify(listProducts));
                return { message: "El producto ha sido cargado correctamente" };
            } catch (error) {
                console.log(
                    "🚀 ~ file: ProductManager ~ addProducts ~ error:",
                    error
                );
            }
        } else {
            return { message: "todos los parametros son requeridos" };
        }
    }

    async getProducts() {
        try {
            const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
            return data;
        } catch (error) {
            console.log(
                "🚀 ~ file: ProductManager ~ getProducts ~ error:",
                error
            );
        }
    }

    getProductById = async (id) => {
        this.products = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const resultadoId = this.products.find((e) => e.id === id);
        if (resultadoId) {
            return resultadoId;
        } else {
            return { message: "Product Not Found" };
        }
    };

    updateProduct = async (id, data) => {
        let listProducts = await this.getProducts();



        let productToUpdate = await this.getProductById(id);
        let productoIndex = this.products.findIndex((e) => e.id === id);
        let codeVerif = listProducts.find((e) => e.code === data.code);
        if (!codeVerif) {
            //let idProduct = listProducts.find((e) => e.id === id);
            try {
                // let productToUpdate = await this.getProductById(id);
                // let productoIndex = this.products.findIndex((e) => e.id === id);
                listProducts[productoIndex] = {
                    ...productToUpdate,
                    ...data,
                    id: id,
                };
                await fs.writeFile(this.path, JSON.stringify(listProducts));
                return { message: "Producto actualizado correctamente" };
            } catch (error) {
                console.log(
                    "🚀 ~ file: ProductManager ~ updateProduct= ~ error:",
                    error
                );
            }
        } else {
            return { message: "el valor del CODE ya se encuentra asignado a otro producto" };
        }



    };

    deleteProduct = async (id) => {
        try {
            let listProducts = await this.getProducts();
            listProducts = listProducts.filter((prod) => prod.id !== id);
            await fs.writeFile(this.path, JSON.stringify(listProducts));
            return { message: "Producto eliminado" };
        } catch (error) {
            console.log(
                "🚀 ~ file: ProductManager ~ deleteProduct ~ error:",
                error
            );
        }
    };
}

// export * from ProductManager;
// //module.exports = ProductManager;

// const productManager = new ProductManager("../products/products.json");
// productManager.getProductById(3)
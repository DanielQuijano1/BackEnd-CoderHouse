import { promises as fs } from "fs";

import { ProductManager } from "./ProductManager.js";

const productManager = new ProductManager("./products/productos.json");

export class Carts {

    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async generateIndex(listCarts) {
        try {
            if (listCarts.length === 0) return 1;
            return listCarts[listCarts.length - 1].id + 1;
        } catch (error) {
            console.log(
                "Carts ~ generateIndex ~ error:",
                error
            );
        }
    }


    async createCart(id, products = []) {

        const listCarts = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const newId = await this.generateIndex(listCarts);

        try {
            listCarts.push({
                id: newId,
                products,
            });
            await fs.writeFile(this.path, JSON.stringify(listCarts));
            return { message: "Carrito Creado con éxito" };
        } catch (error) {
            console.log(
                "Carts ~ createCart ~ error:",
                error
            );
        }
    }

    async getCartById(id) {

        try {
            let listCarts = JSON.parse(await fs.readFile(this.path, "utf-8"));
            const resultId = listCarts.find((e) => e.id === id);
            let newObject = [];
            if (resultId) {
                for (let i in resultId.products)
                    newObject.push({
                        quantity: resultId.products[i].quantity,
                        product: await productManager.getProductById(resultId.products[i].product),
                    });
                return newObject
            } else {
                return { message: "Not found" }
            }
        } catch (error) {
            console.log("Carts ~ getCatrById ~ error:", error)

        }

    }


    async addProductInCartById(id, product) {
        try {
            let listCarts = JSON.parse(await fs.readFile(this.path, "utf-8"));

            console.log("Carts ~ addProductInCartById ~ listCarts:", listCarts)

            let cartToUpdate = listCarts.find((e) => {
                return e.id === id;
            });

            console.log("Carts ~ cartToUpdate ~ cartToUpdate:", cartToUpdate)

            let prod = cartToUpdate.products.find((e) => {
                return e.product === product;
            })

            if (!prod) {
                cartToUpdate.products.push({ product, quantity: 1 });
                await fs.writeFile(this.path, JSON.stringify(listCarts));
                return { message: "Producto cargado correctamente" };
            } else {
                
                let newQuantity = prod.quantity + 1;
                let position = cartToUpdate.products.indexOf(prod);
                let edit = cartToUpdate.products.splice(position, 1, {
                    product,
                    quantity: newQuantity,
                });
                await fs.writeFile(this.path, JSON.stringify(listCarts));
                return { message: "Producto cargado correctamente" };
            }

        } catch (error) {

        }
    }
}
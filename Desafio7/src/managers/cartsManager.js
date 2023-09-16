import ProductsManager from "./productManager.js";
import { cartsModel } from "../models/carts.models.js";

class CartsManager {
    productsManager;

    constructor() {
        this.productsManager = new ProductsManager();
    }

    async getProductInCartById(cartID) {
        try {
            const products = cartsModel.findById(cartID);
            return products
        } catch (error) {
            console.log("🚀 ~ file: CartsManager ~ getProductInCartById ~ error:", error)

        }
    }

    async addProductInCartById(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId)
            if (cart) {
                const prod = await this.productsManager.getProductById(productId)
                if (prod) {
                    const index = cart.products.findIndex(item => item.product == productId)
                    if (index != -1) {
                        cart.products[index].quantity = quantity
                    } else {
                        cart.products.push({ product: productId, quantity: quantity })
                    }
                    const updateCart = await cartsModel.findByIdAndUpdate(cartId, cart)
                    return ({ message: "the product was added successfully" })
                } else {
                    return ({ message: 'product not found', })
                }
            } else {
                return ({ message: 'cart not found' })
            }
        } catch (error) {
            console.log("🚀 ~ file: CartsManager ~ addProductInCartById ~ error:", error)
        }
    }

    async delProductsInCartById(cartId) {
        try {
            const result = await cartsModel.findByIdAndUpdate(cartId, {
                $pull: { products: {} }
            })
            return result;
        } catch (error) {
            console.log("🚀 ~ file: CartsManager ~ delProductsInCartById ~ error:", error)

        }
    }


    async deletProdByIdInCartById(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId)
            if (cart) {
                const index = cart.products.findIndex(item => item.product == productId)
                if (index != -1) {
                    const newCart = cart.products.splice(index, 1)
                    return await cart.save()
                } else {
                    return ({ message: 'product not found in cart', })
                }
            } else {
                return ({ message: 'cart not found', })
            }
        } catch (error) {
            console.log("🚀 ~ file: CartsManager ~ deletProdByIdInCartById ~ error:", error)

        }
    }

    async editQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId)
            if (cart) {
                const prod = await this.productsManager.getProductById(productId)
                if (prod) {
                    const index = cart.products.findIndex(item => item.product == productId)
                    if (index != -1) {
                        cart.products[index].quantity = quantity
                    } else {
                        return ({ message: 'index not found', })
                    }
                    const updateCart = await cartsModel.findByIdAndUpdate(cartId, cart)
                    return ({ message: "the quantity was updated successfully" })
                } else {
                    return ({ message: 'product not found', })
                }
            } else {
                return ({ message: 'cart not found' })
            }

        } catch (error) {
            console.log("🚀 ~ file: CartsManager ~ editQuantity ~ error:", error)
        }
    }

    async insertArray(cartId, arrayProducts) {
        try {
            const arr = arrayProducts
            const prod = await this.getProductInCartById(cartId)
            console.log("🚀 ~ file: CartsManager ~ insertArray ~ prod:", prod)
            if (prod) {
                Object.keys(prod.products).forEach(key => {
                    console.log(key)
                })
                // let idProd = prod.
                // arr.forEach(e => {
                //     console.log(e.product)
                // });
            }
            //console.log("🚀 ~ file: cartsManager.js:109 ~ CartsManager ~ insertArray ~ arr:", arr)
        } catch (error) {
            console.log("🚀 ~ file: CartsManager ~ insertArray ~ error:", error)

        }
    }

}

export default CartsManager
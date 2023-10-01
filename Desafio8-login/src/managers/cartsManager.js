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
            console.log(" file: cartsManager.js:11 ~ CartsManager ~ getProductInCartById ~ error:", error)

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
            console.log("file: cartsManager.js:42 ~ CartsManager ~ addProductInCartById ~ error:", error)
        }
    }

    async delProductsInCartById(cartId) {
        try {
            const result = await cartsModel.findByIdAndUpdate(cartId, {
                $pull: { products: {} }
            })
            return result;
        } catch (error) {
            console.log("file: cartsManager.js:53 ~ CartsManager ~ delProductsInCartById ~ error:", error)

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
            console.log("file: cartsManager.js:74 ~ CartsManager ~ deletProdByIdInCartById ~ error:", error)

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
            console.log("file: CartsManager.js:101 ~ CartsManager ~ editQuantity ~ error:", error)
        }
    }

    async insertArray(cartId, arrayProducts) {
        try {
            const cartProducts = await cartsModel.findById(cartId)//busco el carrito
            if (cartProducts) {
                for (let prod of arrayProducts) {//verifico si existen productos repetidos
                    const index = cartProducts.products.findIndex(p => p.product._id == prod.product);
                    console.log("file: cartsManager.js:111 ~ CartsManager ~ insertArray ~ index:", index)
                    if (index !== -1) {
                        cartProducts.products[index].quantity = prod.quantity;
                    } else {
                        const exists = await this.productsManager.getProductById(prod.product);
                        if (exists) {
                            cartProducts.products.push(prod);
                        } else {
                            return ({ message: 'product not found' })
                        }
                    }
                }
            } else {
                return ({ message: 'cart not found', })
            }
            return await cartProducts.save()
        } catch (error) {
            console.log("file: cartsManager.js:110 ~ CartsManager ~ insertArray ~ error:", error)

        }
    }

}

export default CartsManager
import { cartsModel } from "../models/carts.models.js";
import { ticketModel } from "../models/ticket.models.js";
import { ProductsModel } from "../models/products.models.js";

export default class TicketController {
    date
    constructor() {
        this.date = new Date()
    }


    postBuy = async (req, res) => {
        const { email } = req.body
        //let verifiedStock = [];
        let notEnoughStock = [];
        let totalAmmount = 0;
        let code = Math.floor(100000 + Math.random() * 900000).toString()
        const { cartId } = req.params;
        try {
            const cart = await cartsModel.findById(cartId); //verifico que exista el carrito solicitado
            if (cart) {
                for (let product of cart.products) {
                    const data = await ProductsModel.findById(product.product);//verifico que exista el producto que está en el carrito
                    if (data) {
                        if (product.quantity <= data.stock && product.quantity !== 0) {
                            data.stock -= product.quantity;// al stock de productos le resto la cantidad requerida en el carrito
                            await data.save();//guardo en la bbdd
                            //verifiedStock.push(product)
                            let subTotal = data.price * product.quantity;//calculo el monto total de la compra de ese producto
                            totalAmmount += subTotal;
                        } else {
                            notEnoughStock.push({ product: data._id, quantity: 0 })//armo un nuevo array con los productos que no tienen stock
                        }
                    } else {
                        res.status(404).send({ message: 'Product not found' })
                    }
                }
            }
            cart.products = notEnoughStock//formateo el carrito
            cart.save()//guardo los nuevos datos en el carrito y reemplazo los datos anteriores.
            const newTicket = ticketModel.create(
                { code, amount: totalAmmount, purchaser: email }
            )
            res.status(200).json({
                message: "ticket created successfully"
            })
        } catch (error) {
            console.log(
                "🚀 ~ file: ticket.controllers.js:14 ~ TicketController ~ postBuy ~ error:",
                error
            );
            res.status(400).json({
                message: "error generating ticket",
            });
        }
    }
}

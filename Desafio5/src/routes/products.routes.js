import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager("./products/productos.json")
const productRouter = Router();



productRouter.get('/', async (req, res) => {
    const { limit } = req.query

    const prods = await productManager.getProducts()

    const products = prods.slice(0, limit)

    res.status(200).send(products)
})


productRouter.get('/:pid', async (req, res) => {
    const { id } = req.params

    const prod = await productManager.getProductsByID(parseInt(id))

    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("Producto no encontrado")
})


productRouter.post('/', async (req, res) => {
    const { code } = req.body

    const confirmacion = await productManager.getProductByCode(code)
    if (confirmacion) {
        req.status(400).send("producto ya creado")
    } else {
        const conf = await productManager.addProduct(req.body)
        if (conf)
            res.status(200).send("Producto ya creado")
    }

    const prods = await productManager.getProducts()

    const products = prods.slice(0, limit)

    res.status(200).send(products)
})


productRouter.put('/:pid', async (req, res) => {
    const { id } = req.params

    const confirmacion = await productManager.getProductsByID(parseInt(id))

    if (confirmacion) {
        await productManager.updateProduct(parseInt(id),req.body)
        res.status(200).send("Producto Actualizado")
    }
    else
        res.status(404).send("Producto no encontrado")
})


productRouter.delete('/:pid', async (req, res) => {
    const { id } = req.params

    const confirmacion = await productManager.getProductsByID(parseInt(id))

    if (confirmacion) {
        await productManager.deleteProduct(parseInt(id))
        res.status(200).send("Producto Eliminado")
    }
    else
        res.status(404).send("Producto no encontrado")
})




export default productRouter;
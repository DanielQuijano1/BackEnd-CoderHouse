import { Router } from "express";
//import { ProductManager } from "../ProductManager.js";
import { Carts } from "../Carts.js";

const cartsRouter = Router();

const carts = new Carts("./products/carts.json");
//const productManager = new ProductManager("./products/products.json");

//debe generar un nuevo carrito
cartsRouter.post("/", async (req, res) => {

    // const { products } = req.body;
    const carga = await carts.createCart();

    if (!carga) {
        return res.status(400).json(carga);
    } else {
        res.status(200).json(carga);
    }
});

// debe cargar un producto al carrito seleccionado
cartsRouter.post(`/:cid/product/:pid`, async (req, res) => {
    const { products } = req.body;
    const cid = Number(req.params.cid);
    console.log("~ file: cartsRouter.post ~ cid:", cid);
    const pid = Number(req.params.pid);
    console.log("~ file: cartsRouter.post ~ pid:", pid);
    const carga = await carts.addProductInCartById(cid, pid);
    res.status(200).json(carga);
});

cartsRouter.get("/:cid", async (req, res) => {
    const id = Number(req.params.cid);
    const products = await carts.getCartById(id);
    if (!products) {
        return res.status(404).json(products);
    } else {
        res.status(200).json(products);
    }
});

export default cartsRouter;
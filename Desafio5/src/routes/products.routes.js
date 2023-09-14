import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productRouter = Router();
const productManager = new ProductManager("./products/products.json");

// debe listar todos los productos incluir limit
productRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    const limit = Number(req.query.limit);
    if (limit) {
        return res.status(200).json(products.slice(0, limit));
    } else return res.status(200).json(products);
});

// debe traer sólo el productom seleccionado mediante el pid
productRouter.get("/:pid", async (req, res) => {
    const id = Number(req.params.pid);
    const product = await productManager.getProductById(id);
    if (!product) {
        return res.status(404).json(product);
    } else {
        res.status(200).json(product);
    }
});

//debe agregar nuevos productos
productRouter.post(`/`, async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    const newProduct = await productManager.addProducts(req.body);
    if (!newProduct) {
        return res.status(400).json(newProduct);
    } else {
        res.status(200).json(newProduct);
    }
});

//elimina un producto
productRouter.delete(`/:pid`, async (req, res) => {
    const productToDelete = await productManager.deleteProduct(Number(req.params.pid))
    res.status(200).json(productToDelete)
});

//toma un producto y lo actualiza
productRouter.put(`/:pid`, async (req, res) => {

    const productToUpdate = await productManager.updateProduct(Number(req.params.pid), req.body);
    res.status(200).json(productToUpdate);

});

export default productRouter;
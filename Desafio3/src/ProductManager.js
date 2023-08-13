import { promises as fs } from 'fs'

class ProductManager {

    constructor() {
        this.path = "../products/productos.json";
        this.products = [];
    }


    async addProduct(product) {
        const producto = this.products.find(e => e.code === product.code)

        if (producto) {
            console.log("EL producto ya está en el inventario")
        } else {
            try {
                this.products.push(product)
                await fs.writeFile(this.path, JSON.stringify(this.products))
            } catch (error) {
                console.log("Error en la promesa Async", error)
            }
        }
    }


    async getProducts() {
            const products = JSON.parse(await fs.readFile(this.path, "utf-8"))
            console.log(products)
    }

    getProductsByID = async (id) => {
        this.products = JSON.parse(await fs.readFile(this.path, "utf-8"))
        const resultadoID = this.products.find(e => e.id === id)

        if (resultadoID) {
            console.log(resultadoID)
        } else {
            console.log("Producto no Encontrado")
        }
    }

    updateProduct = async (id, data) => {
        const products = JSON.parse(await fs.readFile(this.path, "utf-8"))
        const indiceProducto = products.findIndex(e => e.id === id)
        if (indiceProducto != -1) {
            products[indiceProducto].code = data.code
            products[indiceProducto].title = data.title
            products[indiceProducto].price = data.price
            products[indiceProducto].thumbnail = data.thumbnail
            products[indiceProducto].stock = data.stock
            products[indiceProducto].category = data.category
            products[indiceProducto].description = data.description
            await fs.writeFile(this.path, JSON.stringify(products))
        } else {
            console.log("Producto no encontrao")
        }
    }

    deleteProduct = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, "utf-8"))
        const producto = products.find(e => e.id === id)
        if (producto) {
            await fs.writeFile(this.path, JSON.stringify(products.filter(e => e.id != id)))
        } else {
            console.log("Error en Borrar el producto")
        }
    }
}

class Product {
    constructor(code, title, price, thumbnail, stock, category, description) {
        const map = new Map([[title], [description], [price], [thumbnail], [code], [stock]])
        if (map.has('') || map.has(0)) {
            console.log('Error en los datos')
        } else {
            this.code = code
            this.title = title
            this.price = price
            this.thumbnail = thumbnail
            this.stock = stock
            this.category = category
            this.description = description
            this.id = Product.incrementarID()
        }
    }

    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }

}
/*

//Testing

//se crean nuevos productos
const producto1 = new Product('FF001', "Funda mototola g8", 250, [], 500, "fundas", "funda para motorola g8")
const producto2 = new Product('FF002', "Funda mototola g8 power", 250, [], 500, "fundas", "funda para motorola g8 power")
const producto3 = new Product('FF003', "Funda mototola g8 plus", 250, [], 500, "fundas", "funda para motorola g8 plus")
*/
// se crea la instancia Product Manager
const adminProduct = new ProductManager("../products/productos.json");

/*
//se llama a getProducts la cual debe devolver un arreglo vacio
console.log(adminProduct.getProducts());

//se llama a addProduct con un elemento de prueba
adminProduct.addProduct(producto1)
adminProduct.addProduct(producto2)
adminProduct.addProduct(producto3)


//se llama a getProducts de nuevo, esta vez tiene que aparecer el producto ya creado
console.log(adminProduct.getProducts());

//se llama a addProducts con los mismos campos de arriba, debe arrojar un error ya que el code estara repetido
adminProduct.addProduct(producto2)

//se evalua getProductsByID para devuelva error si no encuentra el producto, de caso contrario se devuelve el producto
console.log(adminProduct.getProductsByID(15));


//se llama a updateProduct para actualizar la data de uno de los productos
const productoActualizado =
{
    code: "FF003",
    title: "Funda mototola g8 plus lite",
    price: 250,
    thumbnail: [],
    stock: 50,
    category: "fundas",
    description: "funda para motorola g8 plus lite",
}

adminProduct.updateProduct(2, productoActualizado )
*/
// adminProduct.deleteProduct(2)

//se evalua update del producto 2 con getProductsByID
console.log(adminProduct.getProducts());
// console.log(adminProduct.getProductsByID(2));



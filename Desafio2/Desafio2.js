const fs = require("fs");
const { json } = require("react-router-dom");

class ProductManager {

    constructor() {
        this.path = path;
        this.products = [];
    }



    async addProduct(product) {
        const producto = this.products.find(e => e.code === product.code)

        if (producto) {
            console.log("EL producto ya está en el inventario")
        } else {
            try {
                this.products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            } catch (error) {
                console.log("Error en la promesa Async", error)
            }
        }
    }


    async getProducts() {
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            console.log(this.products)
        } catch (error) {
            console.log(error)
        }
    }

    getProductsByID = async (id) => {
        this.products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        const resultadoID = this.products.find(e => e.id === id)

        if (resultadoID) {
            console.log(resultadoID)
        } else {
            console.log("Producto no Encontrado")
        }
    }

    updateProduct = async (id, data) => {
        try {
            let productUpdate = await this._getProductByID(id);
            let productIndex = this.products.findIndex(e => e.id === id)
            this.products[productIndex] = { ...productToUpdate, ...data, id: id }
            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            console.log("producto editado correctamente")
        } catch(error){
            console.log("Error en el UPDATE", error)
        }
    }

    deleteProduct = async(id) => {
        try{
            this.products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            this.products = this.products.filter(product => product.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
        }catch (error){
            console.log("Error en Borrar el producto", error)
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


//Testing

//se crean nuevos productos
const producto1 = new Product('FF001', "Funda mototola g8", 250, [], 500, "fundas", "funda para motorola g8")
const producto2 = new Product('FF002', "Funda mototola g8 power", 250, [], 500, "fundas", "funda para motorola g8 power")
const producto3 = new Product('FF003', "Funda mototola g8 plus", 250, [], 500, "fundas", "funda para motorola g8 plus")

// se crea la instancia Product Manager
const adminProduct = new ProductManager();

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

console.log(adminProduct.getProductsByID(1));

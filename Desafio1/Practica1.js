class ProductManager {

    constructor() {
        this.products = [];
    }

    addProduct(product) {
        const producto = this.products.find(e => e.code === product.code)

        if (producto) {
            console.log("EL producto ya está en el inventario")
        } else {
            this.products.push(product)
        }
    }


    getProducts() {
        console.log(this.products)
    }

    getProductsByID(id) {
        const resultadoID = this.products.find(e => e.id === id)

        if (resultadoID) {
            console.log(resultadoID)
        } else {
            console.log("Producto no Encontrado")
        }
    }
}

class Product {
    constructor(code, title, price, thumbnail, stock, category, description) {
        this.code = code
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
        this.stock = stock
        this.category = category
        this.description = description
        this.id = Product.incrementarID()
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
const producto1 = new Product('FF001',"Funda mototola g8",250,[],500,"fundas","funda para motorola g8")
const producto2 = new Product('FF002',"Funda mototola g8 power",250,[],500,"fundas","funda para motorola g8 power")
const producto3 = new Product('FF003',"Funda mototola g8 plus",250,[],500,"fundas","funda para motorola g8 plus")

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


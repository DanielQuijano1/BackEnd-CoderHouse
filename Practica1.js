class ProductManager {

    constructor() {
        this.products = [];
        this.id = 1;
    }

    addProducts({ title, description, price, thumbnail, code, stock, id }) {
        id = this.id;

        const verifyCode = this.products.some((product) => {
            return product.code === code && !this._isSameId(product);
        });
        if (verifyCode) {
            console.log("El valor introducido ya se encuentra asignado a otro producto")
        } else if (
            title != "" &&
            description != "" &&
            typeof Number(price) != "NaN" &&
            thumbnail != "" &&
            code != "" &&
            stock != "" &&
            stock != undefined &&
            code != undefined &&
            thumbnail != undefined &&
            title != undefined &&
            description != undefined &&
            price != undefined
        ) {
            console.log("producto cargado correctamente");
            this.products.push({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id
            });
            this.id = this.id + 1;
        } else {
            console.log("Todos los parametros son requeridos")
        }
    }

    getProducts(){
        return this.products
    }

    getProductsByID(id){
        const resultadoID = this.products.find(e => e.id === id)

        if(resultadoID){
            return resultadoID
        } else {
            return "No Encontrado"
        }
    }

}




//Testing

// se crea la instancia Product Manager
const adminProduct = new ProductManager();

//se llama a getProducts la cual debe devolver un arreglo vacio
console.log(adminProduct.getProducts());

//se llama a addProduct con un elemento de prueba
adminProduct.addProducts({
    title: 'producto prueba',
    description: 'Este es el primer producto de prueba',
    price: '$50.98',
    thumbnail: 'sin imagen de momento',
    code:'sku-pru234',
    stock: 50,
})

//se llama a getProducts de nuevo, esta vez tiene que aparecer el producto ya creado
console.log(adminProduct.getProducts());

//se llama a addProducts con los mismos campos de arriba, debe arrojar un error ya que el code estara repetido
adminProduct.addProducts({
    title: 'producto prueba',
    description: 'Este es el primer producto de prueba',
    price: '$50.98',
    thumbnail: 'sin imagen de momento',
    code:'sku-pru234',
    stock: 50,
})

//se evalua getProductsByID para devuelva error si no encuentra el producto, de caso contrario se devuelve el producto
console.log(adminProduct.getProductsByID(15));

console.log(adminProduct.getProductsByID(1));

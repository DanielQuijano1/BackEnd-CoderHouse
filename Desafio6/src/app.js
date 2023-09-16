import express from "express";
import { ProductManager } from "../src/ProductManager.js"
import productRouter from "./routes/products.routes.js"
import cartsRouter from "./routes/carts.routes.js";
import path from 'path'
import multer from "multer";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io"

const PORT = 8080;
const app = express();
const pathJson = "./products/products.json"
const productManager = new ProductManager(pathJson);
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});


//=========CONFIG=============
const storage = multer.diskStorage({
    destination: (req, file, db) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, db) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})


//==========MIDLEWEARES==============
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const upload = multer({ storage: storage })
app.use('/static', express.static(path.join(__dirname, '/public')))


//routes
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.post('/upload', upload.single('producto'), (req, res) => {

})

// instancio la clase Server (de Socket.io) con la conexion al puerto (server) como parámetro
const io = new Server(server);

io.on('connection', async (socket) => {
    console.log("Servidor socket.io conectado")

    socket.emit('products', listProducts);

    socket.on('addProd', async prod => {
        try {
            return await productManager.addProducts(prod)
        } catch (error) {
            console.log("🚀 ~ file: io.on ~ error:", error)

        }
    })
    socket.on('delProd', async id => await productManager.deleteProduct(id));
})


//***************CONFIGURACION HANDLEBARS**************/
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));


let listProducts = [];
const cargarProd = async () => {
    try {
        listProducts = await productManager.getProducts();
    } catch (error) {
        console.error("Error: not product found");
    }
};
cargarProd();

app.get("/home", (req, res) => {
    res.status(200).render("home", {
        title: "APP Coderhouse - Lista de productos",
        products: listProducts,
    })
})

app.get("/realtimeproducts", (req, res) => {
    res.status(200).render("realTimeProducts", {
        title: "APP Coderhouse - Tiempo real"
    })
})
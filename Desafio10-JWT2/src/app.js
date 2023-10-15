import express from "express";
import displayRoutes from "express-routemap";
import { __dirname } from "./path.js";
import { mongoDBconnection } from "./db/mongo.config.js";
import session from "express-session"
import sessionConfig from "./db/session.config.js";
import passport from "passport";
import cookieParser from "cookie-parser"
import initializePassport from "./config/passport.config.js";
import { engine } from "express-handlebars";
import path from "path";
import { Server } from "socket.io"
import ProductsManager from "./managers/productManager.js";
import ChatsManager from "./managers/chatsManager.js"
import cors from "cors";
import corsConfig from "./config/cors.config.js";
import { PORT, SIGNED_COOKIE } from "./config/config.js";


class App {
    app;
    port;
    server;
    productsManager;
    chatsManager;
    initializePassport


    constructor(routes, viewsRoutes) {
        this.app = express();
        this.port = PORT;
        this.signed_cookie = SIGNED_COOKIE;
        this.productsManager = new ProductsManager()
        this.chatsManager = new ChatsManager()
        this.initializePassport = initializePassport()

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initHandlebars();
        this.initializeViewsRoutes(viewsRoutes)
    }

    async connectToDatabase() {
        await mongoDBconnection();
    }



    // midleweares
    initializeMiddlewares() {
        this.app.use(cors(corsConfig));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "/public")));
        this.app.use(session(sessionConfig));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(cookieParser(this.signed_cookie)) 
    }


    //Rutas de la API
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use(`/api/`, route.router);
        });
    }


    //rutas de las vistas
    initializeViewsRoutes(viewsRoutes) {
        viewsRoutes.forEach((route) => {
            this.app.use(`/`, route.router);
        });
    }



    //iniciando Express
    async listen() {
        this.server = this.app.listen(this.port, () => {
            displayRoutes(this.app);
            console.log(` App listening on the port ${this.port}`);
        });



        //configuración de socket.io

        const io = new Server(this.server);

        io.on(`connection`, async (socket) => {
            console.log("Servidor socket.io conectado")

            socket.on('products', async () => {
                const productsList = await this.productsManager.getAllProducts();

                socket.emit('products', productsList.docs);
            })

            socket.on('addProd', async (newProd) => {
                try {
                    const { title, description, price, code, stock, category } = newProd;
                    await this.productsManager.addProduct({ title, description, price, code, stock, category });
                    const productsList = await this.productsManager.getAllProducts();
                    socket.emit('products', productsList);
                } catch (error) {
                    console.log("file:  App ~ socket.on ~ error:", error)
                }
            })

            socket.on('deleteProduct', async ({ code }) => {
                try {
                    await this.productsManager.findAndDelete({ code });
                    const productsList = await this.productsManager.getAllProducts();
                    socket.emit('products', productsList);

                } catch (error) {
                    console.log("file: App ~ socket.on ~ error:", error)
                }
            })

            // canal de los mensajes
            socket.on("message", async (data) => {
                try {
                    await this.chatsManager.addMessage(data);
                    //await chatsModel.create(data);
                } catch (error) {
                    console.log("file: socket.on ~ error:", error)

                }
                //const info = await chatsModel.find();
                const info = await this.chatsManager.getAllMessages();
                io.emit("messageLogs", info.reverse());
            });



            //****canal de autenticación
            socket.on("authenticated", (data) => {
                socket.broadcast.emit("newUserConnected", data);
            });

            //canal de autenticación
            socket.on("authenticated", (data) => {
                socket.broadcast.emit("newUserConected", data);
            });
        })
    }


    initHandlebars() {
        this.app.engine("handlebars", engine());
        this.app.set("view engine", "handlebars");
        this.app.set("views", path.resolve(__dirname, "./views"));
    }



}

export default App;
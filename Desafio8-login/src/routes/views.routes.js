import { Router } from "express";
import ProductsManager from "../managers/productManager.js";

class ViewsRoutes {
    path = "";
    router = Router();
    productsManager;

    constructor() {
        this.productsManager = new ProductsManager();

        this.initViewsRoutes();
    }

    async initViewsRoutes() {

        this.router.get("/products/:limit?/:page?/:sort?/:status?/:category?", async (req, res) => {
            let { limit, page, sort, category, status } = req.query;
            try {
                const paginatedProductsList = await this.productsManager.getAllProducts(limit, page, sort, category, status);
                const mappedProducts = await paginatedProductsList.docs.map((prod) => {
                    return {
                        title: prod.title,
                        description: prod.description,
                        price: prod.price,
                        code: prod.code,
                        stock: prod.stock,
                    };
                });
                res.status(200).render("home", {
                    title: "APP Coderhouse - Lista de productos",
                    products: mappedProducts,
                    data: paginatedProductsList,
                });

            } catch (error) {

            }
        });

        this.router.get("/realtimeproducts", (req, res) => {
            res.status(200).render("realTimeProducts", {
                title: "APP Coderhouse - Tiempo real",
            });
        });

        this.router.get(`/chat`, async (req, res) => {
            console.log("es el chat");
            res.render(`chat`);
        });


        this.router.get("/login", async (req, res) => {
            res.render("login");
        });

        this.router.get("/profile", async (req, res) => {
            const user = req.session.user;
            console.log("🚀 ~ file:  router.get ~ user:", user);
            res.render("profile", {
                user,
            });
        });


    }
}

export default ViewsRoutes;
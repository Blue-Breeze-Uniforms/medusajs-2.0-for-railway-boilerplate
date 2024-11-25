import { authenticate, defineMiddlewares } from "@medusajs/medusa"
import { z } from "zod"

export default defineMiddlewares({
    routes: [

        {

            method: "GET",
            matcher: "/customer/**",
            middlewares: [
                authenticate("customer", ["bearer"])
            ],
        },

        {
            matcher: "/store/customers*",
            middlewares: [
                authenticate("customer", ["bearer",'session']),
            ],
        }
    ],
})


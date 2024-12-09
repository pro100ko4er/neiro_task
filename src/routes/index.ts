import express from "express";
import userRouter from "./UserRouter";
import adminRouter from "./AdminRouter";
import modelRouter from "./ModelRouter";

const routes = express()



routes.use('/account', userRouter)
routes.use('/admin', adminRouter)
routes.use('/model', modelRouter)
export default routes
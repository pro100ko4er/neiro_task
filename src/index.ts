import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors'
import errorMiddleware from "./middleware/ErrorMiddleware";
import router from "./routes/index";
import useragent from "express-useragent";
import dotenv from 'dotenv'
import swaggerDocument from './openapi.json'; // Если JSON-файл в проекте
import swaggerUi from 'swagger-ui-express';
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(useragent.express())
app.use('/api', router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorMiddleware)

app.listen(PORT, () => console.log("Server Neiron running port " + PORT))
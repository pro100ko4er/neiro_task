import { NextFunction } from "express";
import ModelService from "../services/ModelService";
import {Response} from 'express'
export default class ModelController {
    static async gpt4(req: any, res: Response, next: NextFunction) {
        try {
            const {id} = req.user
            const {content} = req.body
            await ModelService.gpt4omini(id, content, req, res)
        } catch (error) {
            return next(error)
        }
    }

    static async gpt35turbo(req: any, res: any, next: NextFunction) {
        try {
            const {id} = req.user
            const {content} = req.body
            await ModelService.gpt35turbo(id, content, req, res)
        } catch (error) {
            return next(error)
        }
        
    }
}
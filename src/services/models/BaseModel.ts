import OpenAI, { ClientOptions } from "openai";
import dotenv from 'dotenv'
dotenv.config()
export default class BaseModel {
    public model: string = '';
    public openai: OpenAI | null = null;
    public options: ClientOptions | null = null;
    public price_of_token: number = 0.5
    private apiKey: string = process.env.OPEN_AI_KEY || '';
    private baseURL: string = process.env.ENDPOINT_OPEN_AI || ''
    constructor(model: string) {
        this.model = model
        console.log(this.apiKey)
        this.options = {
            apiKey: this.apiKey,
            baseURL: this.baseURL
        }
        this.openai = new OpenAI(this.options)
    }

    calculate_credits(tokens: number) {
        return this.price_of_token * tokens
    }

}
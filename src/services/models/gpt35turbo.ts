import ApiError from "../../error/ApiError";
import BaseModel from "./BaseModel";

export default class GPT35turbo extends BaseModel {
    constructor() {
        super('gpt-3.5-turbo')
        this.price_of_token = 2
    }
    
    async sendRequest(data: string, req: any, res: any) {
        let resultCharacters = ''
        const result = await this.openai?.chat.completions.create({
            model: this.model,
            messages: [
                {role: 'user', content: data}
            ],
            stream: true
        })
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        if(result) {
            
            for await (const chunk of result) {
                resultCharacters += chunk.choices[0]?.delta?.content || ""
                res.write(`data: ${JSON.stringify(chunk.choices[0]?.delta?.content || "")}\n\n`);
            }
            req.on('close', () => {
                res.end();
            });
            const decrementCredits = this.calculate_credits(resultCharacters.length + data.length)
            console.log(result)
            return {decrementCredits, result}
        }
        throw ApiError.BadRequest("Произошла ошибк при генерации запроса!")
      
    }
}
import GPT4omini from "./models/gpt4omini";
import GPT35turbo from "./models/gpt35turbo";
import AdminService from "./AdminService";
export default class ModelService {
    static async gpt4omini(userId: number, content: string, req: any, res: any) {
        const gpt4 = new GPT4omini()
        const result = await gpt4.sendRequest(content, req, res)
        await AdminService.decrementCredits(userId, result?.decrementCredits)
        return result
    }
    static async gpt35turbo(userId: number, content: string, req: any, res: any) {
        const gpt3 = new GPT35turbo()
        const result = await gpt3.sendRequest(content, req, res)
        console.log(userId)
        console.log(result?.decrementCredits)
        await AdminService.decrementCredits(userId, result?.decrementCredits)
        return result
    }
}
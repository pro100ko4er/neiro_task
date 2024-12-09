export interface BaseModel {
    model: "string"
}

export interface ModelGPT4Message {
    role: string,
    content: string
}

export interface ModelGPT4 extends BaseModel {
    messages: ModelGPT4Message[] | string | null
}


export interface ModelTTS1 extends BaseModel {
    input: string,
    voice: string
}
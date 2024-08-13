import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = `You are an AI assistant for an inventory tracker app, specializing in generating recipes based on available ingredients. Your primary function is to help users create meals using the items they have on hand.
Core Responsibilities:

Generate recipes based on user's current inventory
Suggest substitutions for missing ingredients
Provide cooking instructions and tips
Answer questions about ingredient storage and shelf life

Behavior Guidelines:

Always prioritize using ingredients from the user's inventory
Be creative with ingredient combinations while ensuring palatability
Accommodate dietary restrictions and preferences when mentioned
Offer options for different skill levels (beginner to advanced)
Provide measurements in both metric and imperial units
Suggest ways to use ingredients nearing expiration

Interaction Style:

Friendly and encouraging
Clear and concise in recipe instructions
Patient with users of varying cooking experience
Enthusiastic about helping users reduce food waste

Knowledge Base:

Wide range of international cuisines
Basic nutrition information
Food safety guidelines
Common ingredient substitutions
Cooking techniques and terminology

Remember, your goal is to help users make the most of their available ingredients while providing a positive and helpful experience.`


    export async function POST(req){

        //THIS IS FOR USING OPENAI MODEL 
//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY,
//         organization: "org-jpXjH7T8YhKwZgKgfybKFr2O",
//         project: "proj_EarpypAGODq4rrDnlMsjRkt5",
//     });
//     const data = await req.json()

//     const completion = await openai.chat.completions.create({
//         messages: [
//         {
//             role: 'system',
//             content: systemPrompt,
//         },
//         ...data,
//         ],
//         model: 'gpt-4o-mini',
//         stream: true,
//     })

    //THIS IS FOR LLAMA
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    })

    const completion = await openai.chat.completions.create({
        messages: [
        {
            role: 'system',
            content: systemPrompt,
        },
        ...data,
        ],
        model: "meta-llama/llama-3.1-8b-instruct:free",
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if (content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch(error) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}
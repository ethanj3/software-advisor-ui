// File: app/api/generate-pitch/route.ts

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: Request) {
  // 1) Parse { suggestion }
  const { suggestion } = (await req.json()) as { suggestion?: string }

  if (!suggestion) {
    return NextResponse.json(
      { error: 'No software suggestion provided.' },
      { status: 400 }
    )
  }

  // 2) Build the prompt
  const prompt = `
You are an expert accounting software consultant.
Write a concise, three-paragraph pitch explaining why ${suggestion} is the right choice.
Each paragraph should:
1. Summarize the client’s high-level needs.
2. Explain why ${suggestion} meets those needs.
3. Recommend next steps for evaluation or implementation.
`.trim()

  // 3) Call OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a SaaS recommendation assistant.' },
      { role: 'user',   content: prompt },
    ],
    max_tokens: 1600,
    temperature: 0.7,
  })

  const pitch = completion.choices[0].message.content

  // 4) Return the generated pitch
  return NextResponse.json({ pitch })
}

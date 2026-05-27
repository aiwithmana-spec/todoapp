import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { AiGenerateResponse } from "@/types/quote";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a New Zealand business quoting assistant.
When given a project description and type, generate realistic line items for a professional NZD quote.
Always return ONLY a valid JSON object — no markdown fences, no explanation text.
Use realistic 2024/2025 New Zealand market rates.`;

export async function POST(req: NextRequest) {
  const { description, projectType } = (await req.json()) as {
    description: string;
    projectType: string;
  };

  if (!description?.trim()) {
    return NextResponse.json(
      { error: "Description is required" },
      { status: 400 }
    );
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Project type: ${projectType}
Project description: ${description}

Generate line items for this quote. Return ONLY this JSON structure:
{
  "lines": [
    {"desc": "string", "qty": number, "unit": "each|hr|day|m²|m³|m|kg|L|item|lot", "rate": number}
  ],
  "notes": "optional string with any useful notes for the client"
}

Rules:
- Generate 3–8 relevant, specific line items
- Rates must be realistic NZD amounts (excl. GST) for the NZ market
- desc must be professional and specific (e.g. "Certified electrician – first fix wiring" not "labour")
- Choose the most appropriate unit for each item
- Return ONLY the JSON object`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  try {
    const data = JSON.parse(text) as AiGenerateResponse;
    return NextResponse.json(data);
  } catch {
    // Attempt to extract JSON from the response if wrapped in text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const data = JSON.parse(match[0]) as AiGenerateResponse;
        return NextResponse.json(data);
      } catch {
        // fall through
      }
    }
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: text },
      { status: 500 }
    );
  }
}

// src/app/api/suggest-messages/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({ username: z.string().min(1) });

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { username } = parsed.data;

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // ✅ updated to valid model
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that suggests short, friendly anonymous feedback messages.",
          },
          {
            role: "user",
            content: `Give 5 short (one-line) friendly anonymous feedback messages for a person identified as ${username}.`,
          },
        ],
        max_tokens: 200,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("OpenRouter error:", resp.status, text);
      return NextResponse.json({ error: "AI provider error" }, { status: 502 });
    }

    const data = await resp.json();

    const content = data.choices?.[0]?.message?.content ?? "";
    const suggestions: string[] = content
      .split(/\r?\n/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("Suggest API failed:", err);
    return NextResponse.json({ error: "Suggest failed" }, { status: 500 });
  }
}

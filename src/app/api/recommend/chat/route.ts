import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGING_API_KEY || process.env.HUGGINGFACE_API_KEY || "hf_dummy_key");

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ reply: "Silakan tanyakan sesuatu tentang kelas atau minat Anda." }, { status: 400 });
    }

    const modules = await prisma.module.findMany({
      where: { published: true },
      select: { id: true, title: true, tags: true, description: true }
    });

    const catalogContext = modules.map(m => `- ${m.title}: ${m.description} (Tags: ${m.tags})`).join("\n");

    const prompt = `Anda adalah asisten AI E-Learning bernama LearnAI yang cerdas dan ramah.
Anda menggunakan model open source.
Tugas Anda adalah membantu mahasiswa merekomendasikan kelas berdasarkan minat mereka.
Gunakan katalog kelas berikut ini:
${catalogContext}

Pertanyaan Mahasiswa: ${message}

Jawab dengan ramah, berikan rekomendasi modul yang paling cocok dari katalog di atas beserta alasan singkat mengapa cocok.`;

    try {
      const response = await hf.chatCompletion({
        model: "Qwen/Qwen2.5-72B-Instruct", // Menggunakan model Qwen yang didukung gratis oleh Hugging Face Serverless API
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
      });

      const reply = response.choices[0].message.content || "Maaf, saya tidak dapat memproses permintaan Anda.";
      return NextResponse.json({ reply });
    } catch (hfError) {
      console.error("HF API Error:", hfError);
      // Fallback if HF API key is invalid or rate limited
      return NextResponse.json({
        reply: "Maaf, integrasi AI Open Source sedang mengalami kendala atau API Key HuggingFace belum diatur di sistem. Pastikan untuk menambahkan `HUGGING_API_KEY` di file `.env` Anda."
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ reply: "Maaf, saya sedang mengalami gangguan sistem." }, { status: 500 });
  }
}

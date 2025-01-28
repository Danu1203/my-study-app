import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question } = await req.json();

  // 질문이 없는 경우 처리
  if (!question) {
    return NextResponse.json({ answer: "질문을 입력하세요." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: question }],
      }),
    });

    // 응답이 정상적으로 오지 않은 경우 처리
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();

    // OpenAI API 응답 형식에 대한 검증 추가
    if (data?.choices && data.choices[0]?.message?.content) {
      return NextResponse.json({ answer: data.choices[0].message.content });
    } else {
      return NextResponse.json({ error: "예상치 못한 응답 형식입니다." }, { status: 500 });
    }

  } catch (error) {
    // 서버 오류 처리
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

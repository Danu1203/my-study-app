import dotenv from "dotenv";
import OpenAI from "openai"; // ✅ OpenAI 라이브러리 추가

dotenv.config(); // 환경 변수 로드

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // ✅ OpenAI API 설정

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  console.log("🔍 환경 변수 확인:", apiKey ? "✅ API 키 로드됨" : "❌ API 키 로드 실패");

  if (!apiKey) {
    return res.status(500).json({ error: "API 키가 설정되지 않았습니다." });
  }

  // req.body가 제대로 전달되는지 확인
  let { question } = req.body;
  console.log("📩 받은 질문:", question); // 로그를 찍어서 확인

  // 클라이언트에서 question이 제대로 전달되지 않은 경우
  if (!question) {
    return res.status(400).json({ error: "질문을 입력하세요." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
            당신은 국어 문제를 전문적으로 푸는 AI입니다.  
            반드시 **정답을 선택한 후, 풀이를 제공하세요.**  

            📌 **출력 형식 예시:**  

            📌 정답: ③  

            🔍 풀이  

            1. 문제에서 주어진 자료를 분석  
            2. 선택지가 왜 정답인지 설명  
            3. 풀이를 자세하게 작성하여, 학생이 문제를 이해할 수 있도록 하세요.  

            **출력 규칙:**  
            - **정답과 풀이 사이에는 반드시 줄 바꿈을 추가하세요.**  
            - **풀이 내용에서 각 문장마다 줄 바꿈을 추가하세요.**  
            - **"🔍 풀이" 뒤에도 줄 바꿈을 반드시 추가하세요.**  
            - **각 문장의 끝에 "\\n"을 추가하여 줄 바꿈을 적용하세요.**  
            - **반드시 위의 형식을 따르고 줄 바꿈이 없는 응답은 허용되지 않습니다.**  

            📌 **추가 규칙 (문제 검토 3회)**  
            - AI는 문제를 3번 풀어보고 최종 정답을 제시해야 합니다.  
            - 각 풀이 과정에서 다른 접근법을 시도하고, 정답을 검증하세요.  
            - 최종 정답을 내리기 전에, 기존 풀이를 검토한 후 **가장 논리적인 해석을 채택**하세요.    
            `,
          },
          {
            role: "user",
            content: `다음 국어 문제를 분석하고 정답을 선택한 후, 지정된 형식으로 풀이를 작성하세요.\n\n${question}`,
          },
        ],
        max_tokens: 1500, // ✅ 응답 길이를 충분히 확보 (더 자세한 풀이 제공)
        temperature: 0.3, // ✅ 논리적인 답변 유지
      }),
    });

    const data = await response.json();
    let answer = data.choices[0].message.content;

    // ✅ 후처리: 문장 끝에 줄 바꿈 추가
    answer = answer.replace(/(📌 정답: \d+)/g, "$1\n\n"); // 정답 뒤 줄 바꿈
    answer = answer.replace(/(🔍 풀이)/g, "$1\n\n"); // "풀이" 뒤 줄 바꿈
    answer = answer.replace(/([.!?])\s/g, "$1\n"); // 문장 끝마다 줄 바꿈

    console.log("🔍 OpenAI 응답 (수정 후):", answer);

    if (response.ok) {
      return res.status(200).json({ answer });
    } else {
      return res.status(500).json({ error: "OpenAI API 요청 실패", details: data });
    }
  } catch (error) {
    console.error("🚨 서버 오류 발생:", error);
    return res.status(500).json({ error: "서버 오류 발생", details: error.message });
  }
}
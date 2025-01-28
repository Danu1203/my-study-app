import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// .env.local을 강제로 로드
dotenv.config();
const envConfig = dotenv.parse(readFileSync('.env.local'));
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

console.log("🔍 환경 변수 강제 로딩 테스트...");
console.log("📌 OPENAI_API_KEY 값:", process.env.OPENAI_API_KEY || "❌ 로드 실패! (값이 없음)");
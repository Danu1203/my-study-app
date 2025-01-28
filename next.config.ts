/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,  // 환경 변수 강제 로드
  },
};

module.exports = nextConfig;
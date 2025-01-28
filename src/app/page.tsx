"use client"; // 이 라인을 추가해 주세요

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 진행률 상태
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) {
      alert("질문을 입력하세요.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setProgress(0); // 진행률 초기화

    // 진행률 표시를 위한 가상 인터벌
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(progressInterval); // 90% 이상 되면 인터벌 종료
          return 100; // 완료
        }
        return prevProgress + 5; // 5%씩 증가
      });
    }, 300); // 300ms마다 5%씩 증가

    try {
      // JSON.stringify로 question을 서버로 전송
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 요청 헤더에 Content-Type을 설정
        },
        body: JSON.stringify({
          question, // question을 JSON 객체로 전달
        }),
      });

      const data = await res.json();
      setAnswer(data.answer || "오류 발생!");
    } catch (error) {
      setAnswer("서버 오류 발생!");
    } finally {
      clearInterval(progressInterval); // 응답이 오면 인터벌 종료
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage:
          "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUSEBIVFRAVFQ8VFRUPDxUPFQ8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0NFQ8PFSsZFRktLSsrLSsrLSstKy0tLS0tKystLS0tLS0tLS03Ky0tLS0tLTctLS0rLS03NzctLS0tN//AABEIALcBEwMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQIDB//EACQQAQEBAQACAQMEAwAAAAAAAAABEQIhYTESUZFxocHRA0Gx/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAEDAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A9jUhrJ2mKqABQQAATFTq5+wqwTFoGACCRdTAMUACiaCpYKAmlqoqQVKqLYgChYYAnPv+lkAQSxUBm795+BoFaMTTQUEEUDQE561XP469VFdDAioAAAnn1+RVSLoIIoAigqQKAKAiQpSChqpQVMAQwMBUoUgAYoLhU38qAAAAIrPU1ZUiapf6UooBUBQBExU0FNVMWACWKCCgJFEoi0QtBUZ55aFBQBAAS1akoLoigokUAAQT64qZ5/ApyoCAAAHXoAIAYkqlFEJRBURYCgn0qGmqAn0/ddROQUMAAqUFFiAz2shhQUAC1ZRLAWiSKAAIJapgqYStIDO/efy1AAEUAsARJzhiauoq1MXRRJFqUBFVEAiigigiCb6UUAAABMBQUQwFoM9TQaEkUAGeoI0ACyL9JGMBRqfCTyCU1bSfYVCtQvwIxIta6qUD6UxqwoM9ekrdLQYvohVFTQgBEi4YAQkASkqpQFTQGgSwF0SKABBC0ACVFMFOPC3qRnqp3zv6IN74SUFRdSfIAt6OqiA1e5/tOqmeUsFWz2sEBq1dYBDVQFKQ6LECBooJYoAzjTPPWg0IoKJPCXpKNCT2qgAIFTTUqrBIqiEVnqfZBoRVQBKAUMRVSxUkUVNFEEEoq2FBAipYlqihoBYJqglInEyLQURQFwSgqKAJesVMBJVTrz4/4vM8IKAqJaJ1FRTqh0KKIAqJL5VADS0A1KQFVnmLQBKQFSxRRJ+51FEEVEih7UkEGfKrqqLoiAuqRO6BFTm7FBIoloKEBEIoipYFhQDRQQVFBJFSILpaABgloKEFE1QAxLFSgQADQsANEUFBQRRKBqooJU56laQDAMQKKlUNCGIAEgFqauGAYAoAAIpIgmqCjMny0UASi0EgAKmhYAIoNAAkFAQUBKaCBFBRBQBLQBJPP64TQQKqgCKKIlBNC1OPgAaAUSKAJpQQBRRlQBm/5JAFI//Z')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-2xl font-bold mb-4 text-black">📚 우주 국어 문제 풀이 📚</h1>

      <textarea
        placeholder="정말 모르는 문제는 적고 물어볼 것!"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full max-w-2xl p-4 border rounded-lg text-lg"
        rows={5}
      />

      <div className="mt-4">
        <input
          type="file"
          onChange={handleImageChange}
          className="p-2 border rounded-lg"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        풀이
      </button>

      {loading && (
        <div className="mt-4 text-gray-600">
          단우 선생님이 답을 고민 중... {progress}%
        </div>
      )}

      {answer && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100 flex">
          <div className="mr-4">
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                className="max-w-xs max-h-60 object-contain"
              />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI의 답변:</h2>
            <p>{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
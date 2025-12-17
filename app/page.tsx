"use client";
import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse"; // Import thư viện đọc CSV

// --- CẤU HÌNH ---
// Thay link dưới đây bằng link "Publish to web" (dạng CSV) của bạn
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTy3HgmK1fWX0K1j2li-1qBz9fqoDqTZfNKtYwgKD2AMVjNmKjavQ6z3NXP2j1s-3Ho_PIrvHEteh1P/pub?output=tsv";

// 1. Định nghĩa kiểu dữ liệu
interface DrugData {
  hc: string;
  bd: string;
  ndl: string;
  coche: string;
  cd: string;
  tdp: string;
  ccd: string;
  lesson: number; 
  [key: string]: string | number;
}

export default function Home() {
  const [database, setDatabase] = useState<DrugData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<DrugData | null>(null);
  const [hintType, setHintType] = useState<string>(""); 
  const [showAnswer, setShowAnswer] = useState(false);
  
  // State UI
  const [userNdl, setUserNdl] = useState("");
  const [userCoche, setUserCoche] = useState("");
  const [lessonFilter, setLessonFilter] = useState<number>(0);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- FETCH DỮ LIỆU TỪ GOOGLE SHEET ---
  useEffect(() => {
    setIsLoading(true);
    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true, // Tự động map dòng 1 thành key
      complete: (results) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData: any[] = results.data;
        
        // Lọc bỏ các dòng trống và convert lesson sang number
        const cleanData: DrugData[] = rawData
          .filter(row => row.hc && row.hc.trim() !== "") // Bỏ dòng trống
          .map(row => ({
            ...row,
            lesson: Number(row.lesson) || 1 // Mặc định bài 1 nếu quên nhập
          }));

        if (cleanData.length > 0) {
          setDatabase(cleanData);
          // Random câu đầu tiên sau khi load xong
          generateRandomQuestion(cleanData); 
        } else {
          setError("Không tìm thấy dữ liệu trong Sheet.");
        }
        setIsLoading(false);
      },
      error: (err) => {
        setError("Lỗi tải dữ liệu: " + err.message);
        setIsLoading(false);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lọc dữ liệu theo bài (Dựa trên database đã fetch)
  const filteredDatabase = useMemo(() => {
    if (lessonFilter === 0) return database;
    return database.filter(d => d.lesson === lessonFilter);
  }, [lessonFilter, database]);

  // Hàm random tách riêng để tái sử dụng
  const generateRandomQuestion = (sourceData: DrugData[]) => {
    if (sourceData.length === 0) return;

    setShowAnswer(false);
    setUserNdl("");
    setUserCoche("");
    
    const randomDrug = sourceData[Math.floor(Math.random() * sourceData.length)];
    
    const types = ["cd", "tdp", "ccd"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setCurrentQuestion(randomDrug);
    setHintType(randomType);
  };

  // Wrapper gọi hàm random
  const nextQuestion = () => {
    generateRandomQuestion(filteredDatabase);
  };

  // Reset streak khi đổi bài
  useEffect(() => {
    setStreak(0);
    if (database.length > 0) {
        generateRandomQuestion(filteredDatabase);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonFilter]);

  const handleCorrect = () => {
    setStreak(s => s + 1);
    nextQuestion();
  }

  const handleIncorrect = () => {
    setStreak(0);
    nextQuestion();
  }

  const getHintLabel = (type: string) => {
    switch (type) {
      case "cd": return "CHỈ ĐỊNH";
      case "tdp": return "TÁC DỤNG PHỤ";
      case "ccd": return "CHỐNG CHỈ ĐỊNH";
      default: return "";
    }
  };

  // --- GIAO DIỆN ---
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">⏳ Đang tải dữ liệu từ Google Sheets...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold px-4 text-center">{error}</div>;
  if (!currentQuestion) return <div className="p-10 text-center">Chưa có dữ liệu.</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans pb-20">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        {/* Header Control */}
        <div className="bg-white p-3 flex justify-between items-center border-b">
           {/* Bộ lọc bài học */}
           <select 
              value={lessonFilter}
              onChange={(e) => setLessonFilter(Number(e.target.value))}
              className="bg-gray-100 text-sm font-bold text-gray-700 py-1.5 px-3 rounded-lg outline-none border-none focus:ring-2 focus:ring-blue-200"
           >
              <option value={0}>📚 Tất cả ({database.length})</option>
              <option value={1}>❤️ Bài 1: Tim Mạch</option>
              <option value={2}>🩸 Bài 2: Nội Tiết</option>
           </select>

           {/* Streak Counter */}
           <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="text-orange-700 font-extrabold text-sm">{streak}</span>
           </div>
        </div>

        {/* Question Section */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-2 text-center mt-2">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-1">
              Hoạt chất
            </span>
            <h2 className="text-4xl font-black text-gray-800 break-words tracking-tight">
              {currentQuestion.hc}
            </h2>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-yellow-700 uppercase">
                Gợi ý: {getHintLabel(hintType)}
              </span>
            </div>
            <p className="text-gray-900 font-medium leading-relaxed">
              {currentQuestion[hintType]}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nhóm Dược Lý</label>
              <textarea 
                className={`w-full p-3.5 border rounded-xl text-gray-900 font-medium focus:ring-2 focus:outline-none transition-all ${showAnswer ? 'bg-gray-50' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm'}`}
                placeholder="..."
                rows={1}
                value={userNdl}
                onChange={(e) => setUserNdl(e.target.value)}
                readOnly={showAnswer}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cơ Chế</label>
              <textarea 
                className={`w-full p-3.5 border rounded-xl text-gray-900 font-medium focus:ring-2 focus:outline-none transition-all ${showAnswer ? 'bg-gray-50' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm'}`}
                placeholder="..."
                rows={2}
                value={userCoche}
                onChange={(e) => setUserCoche(e.target.value)}
                readOnly={showAnswer}
              />
            </div>
          </div>

          {/* Đáp án */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAnswer ? 'opacity-100 max-h-[600px]' : 'opacity-0 max-h-0'}`}>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100 space-y-4 mt-2">
              <div className="grid gap-4 text-sm">
                 <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase">Biệt Dược</span>
                    <p className="text-gray-900 font-bold text-lg">{currentQuestion.bd}</p>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase">Nhóm Dược Lý</span>
                        <p className="text-purple-700 font-bold">{currentQuestion.ndl}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase">Cơ Chế</span>
                        <p className="text-gray-800 leading-snug">{currentQuestion.coche}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0 z-10">
          {!showAnswer ? (
            <button 
              onClick={() => setShowAnswer(true)}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] text-lg"
            >
              Kiểm Tra
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleIncorrect}
                className="py-4 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition-all active:scale-[0.98]"
              >
                Chưa thuộc (0)
              </button>
              <button 
                onClick={handleCorrect}
                className="py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Đã thuộc</span>
                <span className="text-xs bg-green-700 px-2 py-0.5 rounded-full">Streak +1</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-6 text-xs text-gray-400 text-center">
        Dữ liệu từ Google Sheets • Made with ❤️
      </p>
    </main>
  );
}
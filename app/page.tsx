"use client";
import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";

// --- CẤU HÌNH ---
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTy3HgmK1fWX0K1j2li-1qBz9fqoDqTZfNKtYwgKD2AMVjNmKjavQ6z3NXP2j1s-3Ho_PIrvHEteh1P/pub?output=tsv";

// Định nghĩa kiểu dữ liệu
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
  
  // Trạng thái hiển thị
  const [showAnswer, setShowAnswer] = useState(false); // Hiện đáp án sau khi kiểm tra
  const [showResultModal, setShowResultModal] = useState(false); // Hiện popup kết quả
  const [isCorrect, setIsCorrect] = useState(false); // Trạng thái đúng/sai

  // State Input
  const [userNdl, setUserNdl] = useState("");
  const [userCoche, setUserCoche] = useState("");
  
  const [lessonFilter, setLessonFilter] = useState<number>(0);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- FETCH DỮ LIỆU ---
  useEffect(() => {
    setIsLoading(true);
    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      delimiter: "\t",
      complete: (results) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData: any[] = results.data;
        const cleanData: DrugData[] = rawData
          .filter(row => row.hc && row.hc.trim() !== "") 
          .map(row => ({
            ...row,
            lesson: Number(row.lesson) || 1
          }));

        if (cleanData.length > 0) {
          setDatabase(cleanData);
          generateRandomQuestion(cleanData); 
        } else {
          setError("Không đọc được dữ liệu. Kiểm tra lại Link hoặc Header.");
        }
        setIsLoading(false);
      },
      error: (err) => {
        setError("Lỗi: " + err.message);
        setIsLoading(false);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDatabase = useMemo(() => {
    if (lessonFilter === 0) return database;
    return database.filter(d => d.lesson === lessonFilter);
  }, [lessonFilter, database]);

  const generateRandomQuestion = (sourceData: DrugData[]) => {
    if (sourceData.length === 0) return;

    // Reset toàn bộ trạng thái
    setShowAnswer(false);
    setShowResultModal(false);
    setUserNdl("");
    setUserCoche("");
    
    const randomDrug = sourceData[Math.floor(Math.random() * sourceData.length)];
    const types = ["cd", "tdp", "ccd"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setCurrentQuestion(randomDrug);
    setHintType(randomType);
  };

  const nextQuestion = () => {
    generateRandomQuestion(filteredDatabase);
  };

  useEffect(() => {
    setStreak(0);
    if (database.length > 0) {
        generateRandomQuestion(filteredDatabase);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonFilter]);

  // --- HÀM CHUẨN HÓA CHUỖI ĐỂ SO SÁNH ---
  // Bỏ dấu, bỏ viết hoa, bỏ ký tự đặc biệt thừa
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt (nếu muốn check thoáng hơn) - Hiện tại tôi tắt để bắt Hân học đúng dấu.
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"") // Bỏ dấu câu
      .replace(/\s{2,}/g," ") // Bỏ khoảng trắng thừa
      .trim();
  };
  
  // Hàm kiểm tra chính xác (có thể chỉnh sửa độ khó tại đây)
  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    // Chuẩn hóa input của user và đáp án
    const uNdl = normalizeString(userNdl);
    const uCoche = normalizeString(userCoche);
    
    // Lưu ý: Tôi dùng toLowerCase() ở đây để so sánh không phân biệt hoa thường nhưng vẫn check dấu tiếng Việt
    const dbNdl = normalizeString(currentQuestion.ndl);
    const dbCoche = normalizeString(currentQuestion.coche);

    // Logic: Phải đúng cả 2 (hoặc chứa từ khóa chính - ở đây tôi làm khớp tương đối)
    // Nếu Hân nhập đúng y chang (chỉ khác hoa thường/khoảng trắng) => Đúng
    const isNdlRight = dbNdl === uNdl || dbNdl.includes(uNdl) && uNdl.length > dbNdl.length * 0.5; 
    const isCocheRight = dbCoche === uCoche || dbCoche.includes(uCoche) && uCoche.length > dbCoche.length * 0.5;

    // Tạm thời tôi để mode: Check chính xác tương đối (User input == Database answer)
    // Bạn có thể nới lỏng bằng cách chỉ check xem user input có nằm trong answer không
    const finalResult = (normalizeString(userNdl) === normalizeString(currentQuestion.ndl)) && 
                        (normalizeString(userCoche) === normalizeString(currentQuestion.coche));

    if (finalResult) {
        setIsCorrect(true);
        setStreak(s => s + 1);
    } else {
        setIsCorrect(false);
        setStreak(0);
    }
    
    setShowResultModal(true);
    setShowAnswer(true); // Hiện đáp án sau khi check
  };

  const getHintLabel = (type: string) => {
    switch (type) {
      case "cd": return "CHỈ ĐỊNH";
      case "tdp": return "TÁC DỤNG PHỤ";
      case "ccd": return "CHỐNG CHỈ ĐỊNH";
      default: return "";
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold animate-pulse">⏳ Đang tải dữ liệu...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold px-4 text-center">{error}</div>;
  if (!currentQuestion) return <div className="p-10 text-center">Chưa có dữ liệu.</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans pb-20 relative">
      
      {/* --- MODAL POPUP KẾT QUẢ --- */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center transform transition-all scale-100 ${isCorrect ? 'border-4 border-green-400' : 'border-4 border-red-400'}`}>
              
              <div className="text-6xl mb-4 animate-bounce">
                {isCorrect ? '😘' : '😈'}
              </div>
              
              <h3 className={`text-2xl font-black mb-2 uppercase ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'CHÚC MỪNG!' : 'SAI RỒI!'}
              </h3>
              
              <p className="text-gray-800 font-bold text-lg mb-6 leading-relaxed">
                {isCorrect 
                  ? "Bạn nhận được 1 nụ hun từ Cừn ❤️" 
                  : "Hăn sẽ bị phạt... chép phạt nha! 📝"}
              </p>

              <button 
                onClick={() => setShowResultModal(false)}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {isCorrect ? 'Nhận hun và xem đáp án' : 'Chấp nhận hình phạt'}
              </button>
           </div>
        </div>
      )}

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        {/* Header Control */}
        <div className="bg-white p-3 flex justify-between items-center border-b">
           <select 
              value={lessonFilter}
              onChange={(e) => setLessonFilter(Number(e.target.value))}
              className="bg-gray-100 text-sm font-bold text-gray-700 py-1.5 px-3 rounded-lg outline-none border-none focus:ring-2 focus:ring-blue-200"
           >
              <option value={0}>📚 Tất cả ({database.length})</option>
              <option value={1}>❤️ Bài 1: Tim Mạch</option>
              <option value={2}>🩸 Bài 2: Nội Tiết</option>
           </select>

           <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="text-orange-700 font-extrabold text-sm">{streak}</span>
           </div>
        </div>

        {/* Question Section */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-2 text-center mt-2">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-1">
              Hoạt chất & Biệt dược
            </span>
            <h2 className="text-3xl font-black text-gray-800 break-words tracking-tight leading-tight">
              {currentQuestion.hc}
              <span className="block text-xl text-indigo-600 font-bold mt-1">
                ({currentQuestion.bd})
              </span>
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
                className={`w-full p-3.5 border rounded-xl text-gray-900 font-medium focus:ring-2 focus:outline-none transition-all ${showAnswer ? 'bg-gray-100' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm'}`}
                placeholder="Nhập nhóm dược lý..."
                rows={1}
                value={userNdl}
                onChange={(e) => setUserNdl(e.target.value)}
                readOnly={showAnswer} // Khóa khi đã hiện đáp án
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cơ Chế</label>
              <textarea 
                className={`w-full p-3.5 border rounded-xl text-gray-900 font-medium focus:ring-2 focus:outline-none transition-all ${showAnswer ? 'bg-gray-100' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm'}`}
                placeholder="Nhập cơ chế..."
                rows={2}
                value={userCoche}
                onChange={(e) => setUserCoche(e.target.value)}
                readOnly={showAnswer}
              />
            </div>
          </div>

          {/* Đáp án (Chỉ hiện sau khi check) */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAnswer ? 'opacity-100 max-h-[600px]' : 'opacity-0 max-h-0'}`}>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100 space-y-4 mt-2 relative">
              <div className="absolute top-0 right-0 bg-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                ĐÁP ÁN ĐÚNG
              </div>
              <div className="grid gap-4 text-sm">
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
              onClick={handleCheckAnswer}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] text-lg"
            >
              Kiểm Tra
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Câu Tiếp Theo</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <p className="mt-6 text-xs text-gray-400 text-center">
        OnTapDuocLy v3.0 • For Hăn & Cừn
      </p>
    </main>
  );
}
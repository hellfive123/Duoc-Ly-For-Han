"use client";
import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";

// --- CẤU HÌNH ---
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTy3HgmK1fWX0K1j2li-1qBz9fqoDqTZfNKtYwgKD2AMVjNmKjavQ6z3NXP2j1s-3Ho_PIrvHEteh1P/pub?output=tsv";

interface DrugData {
  hc: string;
  bd: string;
  ndl: string;
  coche: string;
  cd: string;
  tdp: string;
  ccd: string;
  lesson: number; 
  id: string; // Thêm ID để định danh câu hỏi dễ hơn
  [key: string]: string | number;
}

export default function Home() {
  const [database, setDatabase] = useState<DrugData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<DrugData | null>(null);
  const [hintType, setHintType] = useState<string>(""); 
  
  // Trạng thái hiển thị
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Input
  const [userNdl, setUserNdl] = useState("");
  const [userCoche, setUserCoche] = useState("");
  
  // Logic Review Mode & Streak
  const [wrongList, setWrongList] = useState<DrugData[]>([]); // Danh sách câu sai
  const [isReviewMode, setIsReviewMode] = useState(false); // Đang ở chế độ ôn sai?
  
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
          .map((row, index) => ({ 
            ...row, 
            lesson: Number(row.lesson) || 1,
            id: `${index}-${row.hc}` // Tạo ID duy nhất
          }));

        if (cleanData.length > 0) {
          setDatabase(cleanData);
          generateRandomQuestion(cleanData); 
        } else {
          setError("Lỗi dữ liệu. Kiểm tra Link/Header.");
        }
        setIsLoading(false);
      },
      error: (err) => { setError(err.message); setIsLoading(false); }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDatabase = useMemo(() => {
    if (lessonFilter === 0) return database;
    return database.filter(d => d.lesson === lessonFilter);
  }, [lessonFilter, database]);

  // Hàm chọn câu hỏi (Xử lý cả chế độ thường và chế độ ôn sai)
  const generateRandomQuestion = (sourceData: DrugData[]) => {
    if (sourceData.length === 0) {
        // Nếu đang ôn sai mà hết câu sai -> Quay về chế độ thường
        if (isReviewMode) {
            alert("Chúc mừng! Bạn đã ôn hết các câu sai. Quay lại chế độ thường nhé!");
            setIsReviewMode(false);
            generateRandomQuestion(filteredDatabase);
        }
        return;
    }

    setShowAnswer(false);
    setShowResultModal(false);
    setUserNdl("");
    setUserCoche("");
    
    const randomDrug = sourceData[Math.floor(Math.random() * sourceData.length)];
    const types = ["cd", "tdp", "ccd"];
    setCurrentQuestion(randomDrug);
    setHintType(types[Math.floor(Math.random() * types.length)]);
  };

  const nextQuestion = () => {
      // Nếu đang review thì lấy từ wrongList, không thì lấy từ filter
      const source = isReviewMode ? wrongList : filteredDatabase;
      generateRandomQuestion(source);
  };

  // Reset khi đổi bài học (Chỉ khi KHÔNG ở chế độ review)
  useEffect(() => {
    if (!isReviewMode && database.length > 0) {
        setStreak(0);
        generateRandomQuestion(filteredDatabase);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonFilter]);

  const normalizeString = (str: string) => {
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
      .replace(/\s{2,}/g," ").trim();
  };
  
  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    
    const uNdl = normalizeString(userNdl);
    const uCoche = normalizeString(userCoche);
    const dbNdl = normalizeString(currentQuestion.ndl);
    const dbCoche = normalizeString(currentQuestion.coche);

    // Logic check tương đối
    const isNdlRight = (dbNdl.includes(uNdl) && uNdl.length > dbNdl.length * 0.4) || uNdl === dbNdl;
    const isCocheRight = (dbCoche.includes(uCoche) && uCoche.length > dbCoche.length * 0.4) || uCoche === dbCoche;

    const result = isNdlRight && isCocheRight;

    if (result) {
        setIsCorrect(true);
        setStreak(s => s + 1);

        // NẾU ĐANG REVIEW VÀ TRẢ LỜI ĐÚNG -> XÓA KHỎI LIST SAI
        if (isReviewMode) {
            setWrongList(prev => prev.filter(item => item.id !== currentQuestion.id));
        }

    } else {
        setIsCorrect(false);
        setStreak(0);

        // NẾU TRẢ LỜI SAI -> THÊM VÀO LIST SAI (Nếu chưa có)
        setWrongList(prev => {
            if (prev.find(item => item.id === currentQuestion.id)) return prev;
            return [...prev, currentQuestion];
        });
    }
    
    setShowResultModal(true);
    setShowAnswer(true);
  };

  // HÀM GỢI Ý (HINT SYSTEM)
  const revealHint = (field: 'ndl' | 'coche') => {
      if (!currentQuestion) return;
      if (field === 'ndl') setUserNdl(currentQuestion.ndl);
      if (field === 'coche') setUserCoche(currentQuestion.coche);
  };

  // CHUYỂN ĐỔI CHẾ ĐỘ ÔN TẬP
  const toggleReviewMode = () => {
      if (wrongList.length === 0) return;
      
      if (isReviewMode) {
          // Đang review muốn thoát ra
          setIsReviewMode(false);
          generateRandomQuestion(filteredDatabase);
      } else {
          // Đang thường muốn vào review
          setIsReviewMode(true);
          generateRandomQuestion(wrongList);
      }
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
    <main className={`min-h-screen flex flex-col items-center p-4 font-sans pb-20 relative transition-colors duration-500 ${isReviewMode ? 'bg-orange-50' : 'bg-gray-50'}`}>
      
      {/* POPUP KẾT QUẢ */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center transform transition-all scale-100 ${isCorrect ? 'border-4 border-green-400' : 'border-4 border-red-400'}`}>
              <div className="text-6xl mb-4 animate-bounce">{isCorrect ? '😘' : '😈'}</div>
              <h3 className={`text-2xl font-black mb-2 uppercase ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'CHÚC MỪNG!' : 'SAI RỒI!'}
              </h3>
              
              <p className="text-gray-800 font-bold text-lg mb-6 leading-relaxed">
                {isCorrect ? "Nhận 1 nụ hun từ Cừn ❤️" : "Hăn sẽ bị phạt... chép phạt nha! 📝"}
              </p>

              <button onClick={() => setShowResultModal(false)} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                {isCorrect ? 'Tiếp tục' : 'Xem lại kiến thức'}
              </button>
           </div>
        </div>
      )}

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        {/* THANH ĐIỀU KHIỂN & TRẠNG THÁI */}
        <div className={`p-3 flex justify-between items-center border-b transition-colors ${isReviewMode ? 'bg-orange-100' : 'bg-white'}`}>
           
           {/* Nếu đang Review thì hiện nút Thoát, không thì hiện Select bài */}
           {isReviewMode ? (
               <button 
                onClick={toggleReviewMode}
                className="bg-white text-orange-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-orange-200 shadow-sm flex items-center gap-1"
               >
                 ⬅️ Thoát ôn tập ({wrongList.length})
               </button>
           ) : (
               <select value={lessonFilter} onChange={(e) => setLessonFilter(Number(e.target.value))} className="bg-gray-100 text-sm font-bold text-gray-700 py-1.5 px-3 rounded-lg outline-none">
                  <option value={0}>📚 Tất cả</option>
                  <option value={1}>❤️ Tim Mạch</option>
                  <option value={2}>🩸 Nội Tiết</option>
               </select>
           )}

           <div className="flex items-center gap-3">
              {/* Nút vào Review Mode (Chỉ hiện khi có câu sai và đang không ở chế độ review) */}
              {!isReviewMode && wrongList.length > 0 && (
                  <button 
                    onClick={toggleReviewMode}
                    className="bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse border border-red-200"
                  >
                    Ôn lại {wrongList.length} câu sai 📝
                  </button>
              )}

              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-lg">🔥</span>
                  <span className="text-gray-700 font-extrabold text-sm">{streak}</span>
              </div>
           </div>
        </div>

        {/* NỘI DUNG CÂU HỎI */}
        <div className="p-6 space-y-6">
          <div className="space-y-2 text-center mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-1 ${isReviewMode ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'}`}>
              {isReviewMode ? 'CHẾ ĐỘ ÔN SAI' : 'HOẠT CHẤT & BIỆT DƯỢC'}
            </span>
            <h2 className="text-3xl font-black text-gray-800 break-words tracking-tight leading-tight">
              {currentQuestion.hc}
              <span className="block text-xl text-indigo-600 font-bold mt-1">({currentQuestion.bd})</span>
            </h2>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-yellow-700 uppercase">Gợi ý: {getHintLabel(hintType)}</span>
            </div>
            <p className="text-gray-900 font-medium leading-relaxed">{currentQuestion[hintType]}</p>
          </div>

          {/* INPUT FIELDS VỚI NÚT GỢI Ý */}
          <div className="space-y-4">
            
            {/* Nhóm Dược Lý */}
            <div className="space-y-1 relative">
              <div className="flex justify-between items-center ml-1 mb-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nhóm Dược Lý</label>
                  {!showAnswer && (
                      <button 
                        onClick={() => revealHint('ndl')}
                        className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-200 transition-colors font-bold flex items-center gap-1"
                      >
                        💡 Gợi ý
                      </button>
                  )}
              </div>
              <textarea 
                className={`w-full p-3.5 border rounded-xl text-gray-900 font-medium focus:ring-2 focus:outline-none transition-all ${showAnswer ? 'bg-gray-100' : 'border-gray-200 focus:ring-blue-500'}`} 
                placeholder="Nhập nhóm dược lý..." rows={1} value={userNdl} onChange={(e) => setUserNdl(e.target.value)} readOnly={showAnswer} 
              />
            </div>

            {/* Cơ Chế */}
            <div className="space-y-1 relative">
              <div className="flex justify-between items-center ml-1 mb-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Cơ Chế</label>
                  {!showAnswer && (
                      <button 
                        onClick={() => revealHint('coche')}
                        className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-200 transition-colors font-bold flex items-center gap-1"
                      >
                        💡 Gợi ý
                      </button>
                  )}
              </div>
              <textarea 
                className={`w-full p-3.5 border rounded-xl text-gray-900 font-medium focus:ring-2 focus:outline-none transition-all ${showAnswer ? 'bg-gray-100' : 'border-gray-200 focus:ring-blue-500'}`} 
                placeholder="Nhập cơ chế..." rows={2} value={userCoche} onChange={(e) => setUserCoche(e.target.value)} readOnly={showAnswer} 
              />
            </div>
          </div>

          {/* ĐÁP ÁN */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAnswer ? 'opacity-100 max-h-[600px]' : 'opacity-0 max-h-0'}`}>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100 space-y-4 mt-2 relative">
              <div className="absolute top-0 right-0 bg-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">ĐÁP ÁN ĐÚNG</div>
              <div className="grid gap-4 text-sm">
                 <div className="grid grid-cols-1 gap-4">
                    <div><span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase">Nhóm Dược Lý</span><p className="text-purple-700 font-bold">{currentQuestion.ndl}</p></div>
                    <div><span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase">Cơ Chế</span><p className="text-gray-800 leading-snug">{currentQuestion.coche}</p></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* NÚT BẤM */}
        <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0 z-10">
          {!showAnswer ? (
            <button onClick={handleCheckAnswer} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg text-lg">Kiểm Tra</button>
          ) : (
            <button onClick={nextQuestion} className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2">
              <span>{isReviewMode ? 'Câu Tiếp Theo (Chế độ Ôn)' : 'Câu Tiếp Theo'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
          )}
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-400 text-center">OnTapDuocLy v5.0 • Review Mode Added</p>
    </main>
  );
}
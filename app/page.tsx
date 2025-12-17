"use client";
import { useState, useEffect, useMemo } from "react";

// 1. Định nghĩa kiểu dữ liệu
interface DrugData {
  hc: string;
  bd: string;
  ndl: string;
  coche: string;
  cd: string;
  tdp: string;
  ccd: string;
  lesson: number; // Thêm trường bài học
  [key: string]: string | number;
}

// Dữ liệu thuốc (Đã thêm trường lesson)
const database: DrugData[] = [
  // --- BÀI 1: TIM MẠCH ---
  { lesson: 1, hc: "Acetazolamid", bd: "Acetazolamid", ndl: "Lợi tiểu ức chế Carbonic Anhydrase", coche: "Ức chế tái hấp thu Na+, HCO3-", cd: "H/C độ cao cấp, Tăng nhãn áp", tdp: "Nước tiểu nhiễm kiềm", ccd: "Nhiễm acid máu" },
  { lesson: 1, hc: "Furosemid", bd: "Lasix", ndl: "Lợi tiểu quai", coche: "Ức chế đồng vận chuyển Na+, K+, 2Cl-", cd: "Phù phổi cấp, THA", tdp: "Giảm K+ máu, Giảm V máu", ccd: "Tiền hôn mê gan" },
  { lesson: 1, hc: "Indapamid", bd: "Natrilix SR", ndl: "Lợi tiểu Thiazid", coche: "Ức chế đồng vận chuyển Na+, Cl-", cd: "THA, Phù", tdp: "Giảm Na+, K+ máu", ccd: "Suy thận nặng" },
  { lesson: 1, hc: "Spironolacton", bd: "Verospiron", ndl: "Lợi tiểu tiết kiệm Kali", coche: "Đối kháng Aldosteron", cd: "THA, Cường Aldosteron", tdp: "Tăng K+ máu, Vú to ở nam", ccd: "Tăng K+ máu" },
  { lesson: 1, hc: "Propranolol", bd: "Dorocardyl", ndl: "Chẹn Beta không chọn lọc", coche: "Chẹn Beta 1, Beta 2", cd: "Cường giáp, Run tay, THA", tdp: "Hen suyễn, Tim chậm", ccd: "Hen phế quản" },
  { lesson: 1, hc: "Atenolol", bd: "Atenolol", ndl: "Chẹn Beta 1 chọn lọc", coche: "Chẹn chọn lọc Beta 1", cd: "THA, Đau thắt ngực", tdp: "Mệt mỏi, lạnh đầu chi", ccd: "Suy tim mất bù" },
  { lesson: 1, hc: "Captopril", bd: "Captopril", ndl: "ACEi (Ức chế men chuyển)", coche: "Ức chế men chuyển Angiotensin I -> II", cd: "THA, Suy tim", tdp: "Ho khan, Phù mạch", ccd: "Hẹp ĐM thận 2 bên" },
  { lesson: 1, hc: "Amlodipin", bd: "Amlor", ndl: "Chẹn kênh Calci (DHP)", coche: "Chẹn dòng Ca2+ vào tế bào", cd: "THA, Đau thắt ngực", tdp: "Phù chân, Đỏ bừng mặt", ccd: "Suy tim, Hẹp ĐM chủ" },
  { lesson: 1, hc: "Nitroglycerin", bd: "Nitrostad", ndl: "Nitrat hữu cơ", coche: "Tạo NO gây giãn mạch", cd: "Cắt cơn đau thắt ngực", tdp: "Đau đầu, Hạ HA", ccd: "Tăng áp lực nội sọ" },
  { lesson: 1, hc: "Digoxin", bd: "Digoxin", ndl: "Glycosid tim", coche: "Ức chế bơm Na-K-ATPase", cd: "Suy tim, Rung nhĩ", tdp: "Loạn thị giác (nhìn màu vàng)", ccd: "Block nhĩ thất, Nhịp chậm" },
  { lesson: 1, hc: "Atorvastatin", bd: "Lipitor", ndl: "Statin", coche: "Ức chế HMG-CoA Reductase", cd: "Rối loạn lipid máu", tdp: "Đau cơ, Tăng men gan", ccd: "Bệnh gan tiến triển" },

  // --- BÀI 2: NỘI TIẾT ---
  { lesson: 2, hc: "Insulin", bd: "Novolin / Mixtard", ndl: "Hormon tuyến tụy", coche: "Tăng sử dụng Glucose ở tế bào", cd: "ĐTĐ type 1, ĐTĐ thai kỳ", tdp: "Hạ đường huyết", ccd: "Đang bị hạ đường huyết" },
  { lesson: 2, hc: "Metformin", bd: "Glucophage", ndl: "Biguanid", coche: "Giảm tân tạo đường ở gan", cd: "ĐTĐ type 2 (ưu tiên)", tdp: "Rối loạn tiêu hóa, Acid lactic", ccd: "Suy thận, Suy gan" },
  { lesson: 2, hc: "Gliclazid", bd: "Diamicron", ndl: "Sulfonylure", coche: "Kích thích tụy tiết Insulin", cd: "ĐTĐ type 2", tdp: "Hạ đường huyết, Tăng cân", ccd: "ĐTĐ type 1" },
  { lesson: 2, hc: "Levonorgestrel", bd: "Postinor", ndl: "Progestin", coche: "Ức chế rụng trứng", cd: "Tránh thai khẩn cấp", tdp: "RL kinh nguyệt", ccd: "Đang mang thai" },
  { lesson: 2, hc: "Prednison", bd: "Corticoid", ndl: "Glucocorticoid", coche: "Ức chế Phospholipase A2", cd: "Kháng viêm, Ức chế miễn dịch", tdp: "Hội chứng Cushing, Loét dạ dày", ccd: "Loét dạ dày, Nhiễm nấm" },
  { lesson: 2, hc: "Levothyroxin", bd: "Berlthyrox", ndl: "Hormon tuyến giáp", coche: "Bổ sung T4", cd: "Suy giáp", tdp: "Cường giáp (nếu quá liều)", ccd: "Nhồi máu cơ tim cấp" },
  { lesson: 2, hc: "Carbimazol", bd: "Neo-Mercazole", ndl: "Kháng giáp tổng hợp", coche: "Ức chế tổng hợp hormon giáp", cd: "Cường giáp (Basedow)", tdp: "Giảm bạch cầu hạt", ccd: "Suy gan nặng" },
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState<DrugData | null>(null);
  const [hintType, setHintType] = useState<string>(""); 
  const [showAnswer, setShowAnswer] = useState(false);
  
  // State mới
  const [userNdl, setUserNdl] = useState("");
  const [userCoche, setUserCoche] = useState("");
  const [lessonFilter, setLessonFilter] = useState<number>(0); // 0 = Tất cả
  const [streak, setStreak] = useState(0); // Chuỗi đúng

  // Lọc dữ liệu theo bài
  const filteredDatabase = useMemo(() => {
    if (lessonFilter === 0) return database;
    return database.filter(d => d.lesson === lessonFilter);
  }, [lessonFilter]);

  const generateQuestion = () => {
    setShowAnswer(false);
    setUserNdl("");
    setUserCoche("");
    
    // Random từ danh sách đã lọc
    const randomDrug = filteredDatabase[Math.floor(Math.random() * filteredDatabase.length)];
    
    const types = ["cd", "tdp", "ccd"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setCurrentQuestion(randomDrug);
    setHintType(randomType);
  };

  // Reset streak khi đổi bài
  useEffect(() => {
    setStreak(0);
    generateQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonFilter]);

  const handleCorrect = () => {
    setStreak(s => s + 1);
    generateQuestion();
  }

  const handleIncorrect = () => {
    setStreak(0);
    generateQuestion();
  }

  const getHintLabel = (type: string) => {
    switch (type) {
      case "cd": return "CHỈ ĐỊNH";
      case "tdp": return "TÁC DỤNG PHỤ";
      case "ccd": return "CHỐNG CHỈ ĐỊNH";
      default: return "";
    }
  };

  if (!currentQuestion) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

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
        OnTapDuocLy v2.0 • Made with ❤️
      </p>
    </main>
  );
}
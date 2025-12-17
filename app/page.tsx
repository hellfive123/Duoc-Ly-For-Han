"use client";
import { useState, useEffect } from "react";

// 1. Định nghĩa kiểu dữ liệu
interface DrugData {
  hc: string;
  bd: string;
  ndl: string;
  coche: string;
  cd: string;
  tdp: string;
  ccd: string;
  [key: string]: string;
}

// Dữ liệu thuốc Bài 1 & 2
const database: DrugData[] = [
  // --- BÀI 1: TIM MẠCH ---
  {
    hc: "Acetazolamid",
    bd: "Acetazolamid / Acetazolamide",
    ndl: "Lợi tiểu ức chế Carbonic Anhydrase",
    coche: "Ức chế tái hấp thu Na+, HCO3-",
    cd: "H/C độ cao cấp, Tăng nhãn áp, Động kinh",
    tdp: "Nước tiểu nhiễm kiềm, Nhiễm acid chuyển hóa",
    ccd: "Nhiễm acid máu, Giảm Na K máu, Bệnh Gout",
  },
  {
    hc: "Furosemid",
    bd: "Diurefar 40 / Lasix",
    ndl: "Lợi tiểu quai",
    coche: "Ức chế đồng vận chuyển Na+, K+, 2Cl-",
    cd: "Phù, Tăng huyết áp, Phù phổi cấp",
    tdp: "Giảm V máu, Giảm Na K máu, Tăng đường/lipid/acid uric máu",
    ccd: "Tiền hôn mê gan, Vô niệu, Mất nước",
  },
  {
    hc: "Indapamid",
    bd: "Natrilix SR",
    ndl: "Lợi tiểu Thiazid",
    coche: "Ức chế đồng vận chuyển Na+, Cl-",
    cd: "Tăng huyết áp, Phù",
    tdp: "Giảm Na K máu, Tăng acid uric máu",
    ccd: "Suy thận nặng, Suy gan nặng",
  },
  {
    hc: "Spironolacton",
    bd: "Spinolac / Verospiron",
    ndl: "Lợi tiểu tiết kiệm Kali",
    coche: "Đối kháng Aldosteron",
    cd: "Tăng HA, Phù, Cường Aldosteron",
    tdp: "Tăng K máu, Nam vú to, chảy sữa, RLKN",
    ccd: "Tăng K máu, Suy thận",
  },
  {
    hc: "Propranolol",
    bd: "Dorocardyl / Propranolol",
    ndl: "Chẹn Beta không chọn lọc",
    coche: "Chẹn thụ thể Beta 1, Beta 2 -> Giảm nhịp tim, giảm sức co bóp",
    cd: "THA, Đau thắt ngực, Loạn nhịp tim, Cường giáp",
    tdp: "Tim chậm, Co thắt khí quản, Che lấp dấu hiệu hạ đường huyết",
    ccd: "Hen suyễn, H/C Raynaud, Tim chậm, Block nhĩ thất",
  },
  {
    hc: "Atenolol",
    bd: "Atenolol Stada",
    ndl: "Chẹn Beta 1 chọn lọc",
    coche: "Chẹn chọn lọc Beta 1 -> Giảm nhịp tim, giảm sức co bóp",
    cd: "THA, Đau thắt ngực, Loạn nhịp tim",
    tdp: "Tim chậm, mệt mỏi, lạnh đầu chi",
    ccd: "Tim chậm, Block nhĩ thất, Suy tim mất bù",
  },
  {
    hc: "Bisoprolol",
    bd: "Concor",
    ndl: "Chẹn Beta 1 chọn lọc",
    coche: "Chẹn chọn lọc Beta 1 -> Giảm nhịp tim, giảm sức co bóp",
    cd: "THA, Đau thắt ngực, Suy tim mãn",
    tdp: "Tim chậm, hạ HA, chóng mặt",
    ccd: "Suy tim cấp, Block nhĩ thất, Hen phế quản nặng",
  },
  {
    hc: "Captopril",
    bd: "Captopril",
    ndl: "Ức chế men chuyển (ACEi)",
    coche: "Ức chế men chuyển Angiotensin I thành Angiotensin II",
    cd: "THA, Suy tim",
    tdp: "Ho khan, Phù mạch, Tăng K máu",
    ccd: "Hẹp động mạch thận 2 bên, PNCT, Tiền sử phù mạch",
  },
  {
    hc: "Losartan",
    bd: "Losartan / Cozaar",
    ndl: "Đối kháng thụ thể Angiotensin II (ARB)",
    coche: "Ngăn Angiotensin II gắn vào receptor AT1",
    cd: "THA, Suy tim, Bảo vệ thận ở bệnh nhân ĐTĐ",
    tdp: "Hạ HA, Chóng mặt, Tăng K máu (ít ho hơn ACEi)",
    ccd: "PNCT, Hẹp động mạch thận 2 bên",
  },
  {
    hc: "Amlodipin",
    bd: "Amlodipin / Amlor",
    ndl: "Chẹn kênh Calci (DHP)",
    coche: "Ngăn dòng Ca2+ vào tế bào cơ trơn -> giãn mạch",
    cd: "Tăng HA, Đau thắt ngực",
    tdp: "Phù mắt cá chân, Đỏ bừng mặt, Nhức đầu",
    ccd: "Hạ huyết áp, Sốc tim, Hẹp ĐM chủ",
  },
  {
    hc: "Nifedipin",
    bd: "Adalat / Nifedipin Hasan",
    ndl: "Chẹn kênh Calci (DHP)",
    coche: "Ngăn dòng Ca2+ vào tế bào -> giãn mạch",
    cd: "Tăng HA, Đau thắt ngực, H/C Raynaud",
    tdp: "Đỏ bừng mặt, Hạ HA, Phù mắt cá chân",
    ccd: "Hạ HA, Suy tim, Nhồi máu cơ tim cấp",
  },
  {
    hc: "Nitroglycerin",
    bd: "Nitrostad",
    ndl: "Nitrat hữu cơ",
    coche: "Phóng thích NO gây giãn mạch trực tiếp",
    cd: "Cắt cơn đau thắt ngực, Suy tim trái cấp",
    tdp: "Đỏ bừng mặt, Hạ HA, Tăng áp lực nội sọ",
    ccd: "Hạ HA, Tăng áp lực nội sọ, Dùng chung thuốc cường dương",
  },
  {
    hc: "Digoxin",
    bd: "Digoxin",
    ndl: "Glycosid tim",
    coche: "Ức chế bơm Na+-K+-ATPase -> Tăng sức co bóp cơ tim",
    cd: "Suy tim, Rung nhĩ / Cuồng nhĩ",
    tdp: "Loạn nhịp tim, Rối loạn thị giác (nhìn màu vàng/xanh), Buồn nôn",
    ccd: "Block nhĩ thất, Nhịp chậm, Bệnh cơ tim phì đại",
  },
  {
    hc: "Atorvastatin",
    bd: "Lipitor / Atorvastatin",
    ndl: "Statin",
    coche: "Ức chế HMG-CoA Reductase -> Ngăn tổng hợp Cholesterol",
    cd: "Rối loạn lipid huyết (Tăng LDL, Tăng Cholesterol)",
    tdp: "Đau cơ, Tiêu cơ vân, Tăng men gan",
    ccd: "Suy gan, Bệnh về cơ, PNCT",
  },
  {
    hc: "Fenofibrat",
    bd: "Lipanthyl",
    ndl: "Fibrat",
    coche: "Tăng hoạt tính Lipoprotein Lipase -> Giảm Triglycerid",
    cd: "Tăng Triglycerid máu",
    tdp: "Rối loạn tiêu hóa, Sỏi mật, Đau cơ",
    ccd: "Suy gan, Suy thận, PNCT, Trẻ em",
  },

  // --- BÀI 2: NỘI TIẾT ---
  {
    hc: "Insulin",
    bd: "Novolin / Mixtard",
    ndl: "Hormon tuyến tụy",
    coche: "Tăng vận chuyển và sử dụng Glucose ở tế bào",
    cd: "ĐTĐ type 1, ĐTĐ type 2 (khi cần), ĐTĐ thai kỳ",
    tdp: "Hạ đường huyết quá mức, Loạn dưỡng mô tiêm, Dị ứng",
    ccd: "Hạ đường huyết",
  },
  {
    hc: "Metformin",
    bd: "Glucophage / Glucofine",
    ndl: "Biguanid",
    coche: "Giảm sản xuất glucose ở gan, Tăng nhạy cảm insulin ngoại biên",
    cd: "ĐTĐ type 2 (Lựa chọn đầu tay)",
    tdp: "RLTH (tiêu chảy, buồn nôn), Nhiễm acid lactic, Miệng vị kim loại",
    ccd: "Suy thận, Suy gan, Suy tim nặng, Nghiện rượu",
  },
  {
    hc: "Gliclazid",
    bd: "Diamicron",
    ndl: "Sulfonylure",
    coche: "Kích thích tế bào Beta tụy tiết Insulin",
    cd: "ĐTĐ type 2 (người không béo phì)",
    tdp: "Hạ đường huyết, Tăng cân",
    ccd: "ĐTĐ type 1, Suy gan/thận nặng, PNCT",
  },
  {
    hc: "Acarbose",
    bd: "Glucobay",
    ndl: "Ức chế Alpha-glucosidase",
    coche: "Ức chế men Alpha-glucosidase -> Giảm hấp thu glucose ở ruột",
    cd: "ĐTĐ type 2 (giảm đường huyết sau ăn)",
    tdp: "Đầy hơi, Sình bụng, Tiêu chảy",
    ccd: "Viêm ruột, Tắc ruột, Suy gan/thận",
  },
  {
    hc: "Levonorgestrel",
    bd: "Postinor / Newchoice",
    ndl: "Hormon sinh dục nữ (Progestin)",
    coche: "Ức chế quá trình rụng trứng, làm dày chất nhầy cổ tử cung",
    cd: "Tránh thai khẩn cấp, Tránh thai hàng ngày",
    tdp: "Rối loạn kinh nguyệt, Buồn nôn, Căng ngực",
    ccd: "Đang mang thai, Ung thư vú, Xuất huyết âm đạo chưa rõ NN",
  },
  {
    hc: "Prednison",
    bd: "Prednison",
    ndl: "Glucocorticoid (GC)",
    coche: "Ức chế gen tổng hợp protein gây viêm (Phospholipase A2)",
    cd: "Kháng viêm, Chống dị ứng, ức chế miễn dịch",
    tdp: "Hội chứng Cushing, Loét dạ dày, Loãng xương, Dễ nhiễm trùng",
    ccd: "Loét dạ dày tá tràng, Nhiễm nấm/virus toàn thân",
  },
  {
    hc: "Levothyroxin",
    bd: "Berlthyrox / Levothyrox",
    ndl: "Hormon tuyến giáp",
    coche: "Bổ sung hormon T4 ngoại sinh",
    cd: "Suy giáp, Sau phẫu thuật ung thư giáp",
    tdp: "Cường giáp (nhịp nhanh, sụt cân, mất ngủ) nếu quá liều",
    ccd: "Cường giáp chưa điều trị, Nhồi máu cơ tim cấp",
  },
  {
    hc: "Carbimazol",
    bd: "Neo-Mercazole",
    ndl: "Thuốc kháng giáp trạng tổng hợp",
    coche: "Ức chế enzym Peroxidase -> Ngăn tổng hợp hormon giáp",
    cd: "Cường giáp (Basedow)",
    tdp: "Giảm bạch cầu hạt, Dị ứng da, Viêm gan",
    ccd: "Suy gan nặng, Suy tủy",
  },
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState<DrugData | null>(null);
  const [hintType, setHintType] = useState<string>(""); 
  const [showAnswer, setShowAnswer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  // Thêm state lưu nội dung người dùng nhập
  const [userNdl, setUserNdl] = useState("");
  const [userCoche, setUserCoche] = useState("");

  const generateQuestion = () => {
    setIsLoading(true);
    setShowAnswer(false);
    // Reset ô nhập liệu
    setUserNdl("");
    setUserCoche("");
    
    const randomDrug = database[Math.floor(Math.random() * database.length)];
    
    // Random gợi ý
    const types = ["cd", "tdp", "ccd"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setCurrentQuestion(randomDrug);
    setHintType(randomType);
    
    setTimeout(() => setIsLoading(false), 300);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const getHintLabel = (type: string) => {
    switch (type) {
      case "cd": return "CHỈ ĐỊNH";
      case "tdp": return "TÁC DỤNG PHỤ";
      case "ccd": return "CHỐNG CHỈ ĐỊNH";
      default: return "";
    }
  };

  if (!currentQuestion) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white text-center shadow-sm">
          <h1 className="text-2xl font-bold uppercase tracking-wide">Ôn Tập Dược Lý</h1>
          <p className="text-xs opacity-80 mt-1">Bài 1 & 2 • {database.length} Thuốc</p>
        </div>

        {/* Question Section */}
        <div className="p-6 space-y-6">
          
          {/* Đề bài: Hoạt chất */}
          <div className="space-y-2 text-center">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wider mb-2">
              HOẠT CHẤT CẦN NHỚ
            </span>
            <h2 className="text-4xl font-extrabold text-gray-800 break-words drop-shadow-sm">
              {currentQuestion.hc}
            </h2>
          </div>

          {/* Gợi ý ngẫu nhiên */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold text-yellow-700 uppercase">
                Gợi ý ({getHintLabel(hintType)})
              </span>
            </div>
            <p className="text-gray-800 font-medium leading-relaxed">
              {currentQuestion[hintType]}
            </p>
          </div>

          {/* Form nhập liệu của người dùng */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nhóm Dược Lý (?)</label>
              <textarea 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${showAnswer ? (userNdl ? 'bg-gray-50' : 'bg-red-50 border-red-200') : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                placeholder="Nhập nhóm dược lý..."
                rows={2}
                value={userNdl}
                onChange={(e) => setUserNdl(e.target.value)}
                readOnly={showAnswer} // Khóa không cho sửa khi đã hiện đáp án
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Cơ Chế (?)</label>
              <textarea 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${showAnswer ? (userCoche ? 'bg-gray-50' : 'bg-red-50 border-red-200') : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                placeholder="Nhập cơ chế tác dụng..."
                rows={3}
                value={userCoche}
                onChange={(e) => setUserCoche(e.target.value)}
                readOnly={showAnswer}
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Phần hiển thị đáp án đúng (So sánh) */}
          <div className={`transition-all duration-500 ease-in-out ${showAnswer ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">✓</span>
                 <h3 className="font-bold text-blue-800 uppercase text-sm">Đáp Án Chuẩn</h3>
              </div>
              
              <div className="grid gap-3 text-sm">
                 <div>
                    <span className="font-bold text-gray-500 text-xs block mb-1">BIỆT DƯỢC</span>
                    <p className="text-gray-900 font-semibold">{currentQuestion.bd}</p>
                 </div>
                 <div>
                    <span className="font-bold text-gray-500 text-xs block mb-1">NHÓM DƯỢC LÝ</span>
                    <p className="text-purple-700 font-bold">{currentQuestion.ndl}</p>
                 </div>
                 <div>
                    <span className="font-bold text-gray-500 text-xs block mb-1">CƠ CHẾ</span>
                    <p className="text-gray-800">{currentQuestion.coche}</p>
                 </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 p-5 border-t border-gray-100">
          {!showAnswer ? (
            <button 
              onClick={() => setShowAnswer(true)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98]"
            >
              Kiểm Tra Đáp Án
            </button>
          ) : (
            <button 
              onClick={generateQuestion}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Câu Tiếp Theo</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 text-center max-w-xs">
        Mẹo: Hãy cố gắng tự nhớ và ghi ra trước khi xem đáp án để nhớ lâu hơn.
      </p>
    </main>
  );
}
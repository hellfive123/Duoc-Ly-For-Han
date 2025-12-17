"use client";
import { useState, useEffect } from "react";

// 1. Định nghĩa kiểu dữ liệu cho thuốc để TypeScript hiểu
interface DrugData {
  hc: string;
  bd: string;
  ndl: string;
  coche: string;
  cd: string;
  tdp: string;
  ccd: string;
  [key: string]: string; // Dòng này cho phép truy cập động (ví dụ: data['cd'])
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
  // 2. Định nghĩa kiểu dữ liệu cho state
  const [currentQuestion, setCurrentQuestion] = useState<DrugData | null>(null);
  const [hintType, setHintType] = useState<string>(""); 
  const [showAnswer, setShowAnswer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  // Hàm random thuốc và gợi ý
  const generateQuestion = () => {
    setIsLoading(true);
    setShowAnswer(false);
    
    // Random thuốc
    const randomDrug = database[Math.floor(Math.random() * database.length)];
    
    // Random loại gợi ý (1 trong 3)
    const types = ["cd", "tdp", "ccd"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setCurrentQuestion(randomDrug);
    setHintType(randomType);
    
    setTimeout(() => setIsLoading(false), 300);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  // Map mã gợi ý sang tên hiển thị
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
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white text-center">
          <h1 className="text-xl font-bold uppercase">Ôn Tập Dược Lý (Bài 1 & 2)</h1>
          <p className="text-sm opacity-90">Tổng số thuốc: {database.length}</p>
        </div>

        {/* Question Section */}
        <div className="p-6 space-y-6">
          
          {/* Hoạt chất (Đề cho) */}
          <div className="space-y-2 text-center">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold tracking-wide">
              ĐỀ CHO HOẠT CHẤT
            </span>
            <h2 className="text-3xl font-extrabold text-gray-800 break-words">
              {currentQuestion.hc}
            </h2>
          </div>

          {/* Random Hint (Đề cho 1 trong 3) */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-yellow-600 uppercase">
                Gợi ý ({getHintLabel(hintType)})
              </span>
            </div>
            <p className="text-gray-700 font-medium">
              {currentQuestion[hintType]}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Phần trả lời (Che/Hiện) */}
          <div className={`space-y-4 transition-all duration-300 ${showAnswer ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Biệt Dược</p>
              <p className="text-lg font-semibold text-blue-600">{currentQuestion.bd}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Nhóm Dược Lý</p>
              <p className="text-lg font-semibold text-purple-600">{currentQuestion.ndl}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Cơ Chế</p>
              <p className="text-md text-gray-700">{currentQuestion.coche}</p>
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 p-4 flex gap-3 border-t">
          {!showAnswer ? (
            <button 
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md"
            >
              Hiện Đáp Án
            </button>
          ) : (
            <button 
              onClick={generateQuestion}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2"
            >
              Câu Tiếp Theo
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <p className="mt-6 text-xs text-gray-400">
        Dữ liệu từ Bài 1 & 2 - Dược Lý
      </p>
    </main>
  );
}
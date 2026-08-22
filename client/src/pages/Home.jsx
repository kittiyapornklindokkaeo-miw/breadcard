import Card from "../assets/cardblack.svg"

const features = [
    {
        icon: "🏷️",
        title: "จัดหมวดหมู่คำศัพท์",
        desc: "สร้างและจัดระเบียบคำศัพท์ด้วยหมวดหมู่ที่กำหนดเอง",
        iconColor: "text-purple-500",
        bgColor: "bg-yellow-200"
    },
    {
        icon: "📝",
        title: "เพิ่ม ลบ แก้ไข",
        desc: "จัดการคำศัพท์ได้อย่างอิสระ ง่ายและรวดเร็ว",
        iconColor: "text-emerald-700",
        bgColor: "bg-blue-200"
    },
    {
        icon: "🎯",
        title: "ฝึกออกเสียง & เก็บคะแนน",
        desc: "ฝึกพูดคำศัพท์และติดตามความก้าวหน้าของคุณ",
        iconColor: "text-amber-600",
        bgColor: "bg-red-200"
    },
]

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center font-itim">
            <div style={{ animation: "float 3s ease-in-out infinite" }}>
                <img src={Card} className="w-100 h-80" />
            </div>
            <h1 className="text-secondary text-4xl text-center font-bold leading-snug mb-3">มาสร้างแฟลชการ์ดคำศัพท์ของคุณกัน</h1>
            <p className="text-center text-stone-400 max-w-xs">เรียนรู้คำศัพท์ใหม่ ฝึกออกเสียง และติดตามความก้าวหน้าในที่เดียว</p>
            {/* Features  */}
            <div className="mx-auto w-full">
                <p className="text-center text-sm tracking-widest uppercase text-stone-300 my-4">
                    ฟีเจอร์ทั้งหมด
                </p>

                <div className="flex flex-wrap justify-center gap-5">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="w-sm flex items-center gap-4 bg-white border border-stone-100 rounded-2xl px-5 py-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                        >
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${f.bgColor} ${f.iconColor}`}>
                                {f.icon}
                            </div>
                            <div>
                                <p className="font-bold text-base text-stone-800 m-0">{f.title}</p>
                                <p className="text-xs text-stone-400 mt-0.5">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Home
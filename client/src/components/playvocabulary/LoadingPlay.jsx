import Logo from "../../assets/logo_not_name_black.svg"
import Flower1 from "../../assets/flower1.svg"
import Flower2 from "../../assets/flower2.svg"
import { FaHeadphones } from "react-icons/fa6";

const LoadingPlay = ({ progress }) => {
    return (
        <div className="space-y-5">
            <div className="relative flex justify-center items-center w-sm">
                <img src={Logo} alt="logo-breadcard" width={100} />
                <div style={{ animation: "float 3s ease-in-out infinite" }} className="absolute -top-5 left-35 w-3 h-3 rounded-full bg-white border border-secondary" />
                <div style={{ animation: "float 3s ease-in-out infinite" }} className="absolute bottom-15 left-25 w-1 h-1 rounded-full bg-white border border-secondary" />
                <div style={{ animation: "float 3s ease-in-out infinite" }} className="absolute bottom-10 right-30 w-1 h-1 rounded-full bg-white border border-secondary" />
                <div style={{ animation: "float 3s ease-in-out infinite" }} className="absolute top-20 right-25 w-3 h-3 rounded-full bg-white border border-secondary" />
                <img src={Flower1} style={{ animation: "float 3s ease-in-out infinite" }} className="absolute -top-5 right-30 w-7" />
                <img src={Flower2} style={{ animation: "float 3s ease-in-out infinite" }} className="absolute top-20 left-25 w-7" />
            </div>
            <div className="relative bg-white w-full h-5 rounded-full outline-1 outline-secondary">
                <div style={{ width: `${progress}%`, transition: "width 0.3s ease-in-out" }} className="absolute h-5 bg-secondary rounded-full" />
            </div>
            {/* <p>{progress}%</p> */}
            <div className="flex justify-center items-center gap-3 ">
                <button className="bg-stone-400 rounded-full w-5 h-5 flex justify-center items-center">
                    <FaHeadphones className="text-stone-100 size-3" />
                </button>
                <p className="text-stone-400 text-sm">ใส่หูฟังเพื่อเพิ่มประสิทธิภาพความแม่นยำในการให้คะแนน</p>
            </div>
        </div>
    )
}
export default LoadingPlay
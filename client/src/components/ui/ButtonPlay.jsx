import { FaPlay } from "react-icons/fa";

const ButtonPlay = () => {
    return (
        <div className="flex items-center gap-3">
            <button type="button" className="group w-10 h-10 rounded-full bg-secondary text-white flex justify-center items-center transition-transform hover:scale-95"><FaPlay className="" /></button>
            <span className="font-bold text-lg">เล่นคำศัพท์</span>
        </div>

    )
}
export default ButtonPlay 
import { GoStar, GoStarFill } from "react-icons/go";
import { TbReload } from "react-icons/tb";
import { GrHomeRounded } from "react-icons/gr";
import { useAuth } from "../../context/AuthContext";
import { RiUser5Fill } from "react-icons/ri";

const TOTAL_STARS = 5

function calculateStars(point, total) {
    if (!total || total <= 0) return 0
    const percentage = point / total
    const stars = Math.round(percentage * TOTAL_STARS)
    // กันกรณี percentage ต่ำกว่า 0 หรือเกิน 100% (เช่น data ผิดปกติ)
    return Math.min(TOTAL_STARS, Math.max(0, stars))
}

const ResultSummary = ({ point, total, onPlayAgain, onBackToList }) => {
    const { user } = useAuth()

    const filledStars = calculateStars(point, total)
    return (
        <div className="flex justify-center items-center gap-5 w-auto bg-white border border-stone-200 rounded-xl p-5">
            <div className="bg-stone-400 w-40 h-40 rounded-xl border border-stone-200 overflow-clip">
                {user?.url ? <img src={user.url} /> : <RiUser5Fill className="size-5 fill-neutral" />}
            </div>
            <div className="h-full space-y-3 text-center">
                <div className="flex gap-1">
                    {Array.from({ length: TOTAL_STARS }).map((_, i) => (
                        i < filledStars
                            ? <GoStarFill key={i} className="size-7 fill-yellow-400" />
                            : <GoStar key={i} className="size-7 fill-yellow-400" />
                    ))}
                </div>
                <div className="">
                    <p className="text-stone-400">คะแนนรวมของคุณ</p>
                    <p className="font-livvic font-semibold text-stone-400"><span className="font-bold text-4xl text-secondary">{point.toFixed(2)}</span>/ {total}</p>
                </div>
                <div className="flex justify-center gap-5">
                    <button type="button" onClick={onPlayAgain} className="rounded-full p-2 bg-sky-400"><TbReload className="size-5 text-white" /></button>
                    <button type="button" onClick={onBackToList} className="flex justify-center items-center rounded-full p-2 bg-red-400"><GrHomeRounded className="size-5 text-white" /></button>
                </div>
            </div>
        </div>
    )
}
export default ResultSummary
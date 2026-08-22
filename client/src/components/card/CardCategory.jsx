import { GoFileDirectoryFill } from "react-icons/go"
import Option from "../ui/Option"
import { Link } from "react-router"
import { dateFormat } from "../../utils/dateFormat"

const CardCategory = ({ data, onDelete, onEdit, onOpen }) => {
    return (
        <div className="card-hover group flex gap-3 w-full bg-white border border-secondary-content rounded-lg p-3 hover:bg-zinc-50 cursor-default">
            {/*image*/}
            <div className="shrink-0 w-20 h-20 overflow-clip rounded-lg border border-secondary-content">
                {
                    data.url ? (
                        <img src={data.url} className="w-full h-full object-cover" />
                    ) : (
                        <div className="bg-stone-50 h-full flex justify-center items-center">
                            <GoFileDirectoryFill className="size-10 fill-stone-200" />
                        </div>
                    )
                }
            </div>
            {/* category infomation */}
            <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <button onClick={onOpen} type="button" className="font-bold text-secondary line-clamp-1 hover:underline">{data.category_name}</button>
                        <button type="button" className="w-fit text-sm text-start text-stone-500 bg-stone-50 group-hover:bg-white rounded-full border border-secondary-content px-2">{data.total_decks} ชุดคำศัพท์</button>
                    </div>
                    <Option onDelete={onDelete} onEdit={onEdit} />
                </div>
                <span className="text-xs text-stone-400">{dateFormat(data.updatedAt)}</span>
            </div>
        </div >
    )
}
export default CardCategory
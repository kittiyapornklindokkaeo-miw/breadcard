import Option from "../ui/Option"
import { GoFileDirectoryFill, GoHeart } from "react-icons/go";
import { Link } from "react-router";
import { dateFormat } from "../../utils/dateFormat";
import FavoriteButton from "../ui/FavoriteButton";

const CardDeck = ({ data, status, variant = true, onDelete, onEdit, onFavorite }) => {
    return (
        <div className="card-hover group w-full h-auto bg-stone-100 rounded-xl cursor-default overflow-clip border border-secondary-content">
            <div className="flex justify-between py-2 px-3">
                <span className="text-stone-600">{data?.category_name ?? 'ไม่มีหมวดหมู่'}</span>
                {
                    variant && (<Option onDelete={onDelete} onEdit={onEdit} style="text-white" />)
                }

            </div>
            {/* name deck */}
            <div className="h-full bg-white rounded-t-xl border-t border-secondary-content p-3 space-y-2">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-xs text-stone-400">{dateFormat(data?.createdAt)}</span>
                        <Link to={`/user/deck/${data.id}/vocabulary`} className="font-bold text-lg capitalize line-clamp-1 hover:underline">{data?.deck_name}</Link>
                    </div>
                    <button type="button" className="h-fit bg-pink-100 rounded-full px-3 py-1 text-xs">แต้มสูงสุด {data?.max_point ?? 0} คะแนน</button>
                </div>
                <div className="w-full border border-dashed border-stone-200" />
                {/* favorite */}
                <div className="flex justify-between items-baseline-last">
                    <span>{data?.total_vocab ?? 0} คำ</span>
                    <FavoriteButton onFavorite={onFavorite} status={status} />
                </div>
            </div>

        </div>
    )
}
export default CardDeck
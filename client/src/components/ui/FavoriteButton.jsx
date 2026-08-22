import { GoHeart, GoHeartFill } from "react-icons/go"

const FavoriteButton = ({ onFavorite, status }) => {
    return (
        <button
            type="button"
            onClick={onFavorite}
            className={`group flex justify-between items-center gap-2 w-auto rounded-md font-medium px-1 py-1 ${status ? 'bg-stone-100' : 'border border-stone-300'}`}
        >
            <span className={`text-xs ${status ? 'text-secondary' : 'text-stone-400'}`}>ชื่นชอบ</span>
            {
                status ? (
                    <GoHeartFill className="size-4 fill-accent hover:text-accent/50" />
                ) : (
                    <GoHeart className="size-4 text-stone-400 group-hover:text-accent" />
                )
            }

        </button>
    )
}
export default FavoriteButton
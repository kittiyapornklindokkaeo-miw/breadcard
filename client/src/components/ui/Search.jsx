import { GoSearch } from "react-icons/go";

const Search = ({ value, onChange }) => {
    return (
        <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-md outline outline-secondary-content focus-within:outline-stone-400">
            <GoSearch className="text-stone-400" />
            <input
                type="text"
                value={value}
                placeholder="ค้นหา..."
                onChange={onChange}
                className="w-full font-itim focus:outline-none lg:w-60"
            />
        </div>
    )
}
export default Search
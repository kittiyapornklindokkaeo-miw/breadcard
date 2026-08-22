import { useState } from "react"
import CardDeck from "../card/CardDeck"
import { FaCheck } from "react-icons/fa6"

const ModalCategory = ({ data, deckSelected, clickDelete, setClickDelete, onFavorite, onCheck, onDelete, onClose }) => {
    const [select, setSelect] = useState(false)
    return (
        <div className="space-y-3 font-itim">
            <div className="flex justify-between items-baseline-last">
                <h1 className="font-bold text-lg text-secondary">หมวดหมู่</h1>
                {
                    clickDelete ? (
                        <div className="flex">
                            <button onClick={onClose} type="button" className="text-stone-400 hover:bg-stone-50 px-2 rounded-md">ยกเลิก</button>
                            <button onClick={onDelete} type="button" className="text-accent hover:bg-red-50 px-2 rounded-md">ลบ</button>
                        </div>
                    ) : (
                        <button onClick={() => setClickDelete(true)} type="button" className="text-accent hover:bg-red-50 px-2 rounded-md">เลือก</button>
                    )
                }
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {
                    data.map((i) => (
                        <div key={i.id} className={`${clickDelete ? 'flex justify-start items-start gap-3 border border-secondary-content rounded-xl p-3 transition-all' : ''}`}>
                            {clickDelete && (
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={i.id}
                                        checked={deckSelected.includes(i.id)}
                                        onChange={onCheck}
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-secondary-content transition-all  checked:border-secondary checked:bg-secondary"
                                    />
                                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                        <FaCheck size={14} />
                                    </div>
                                </div>
                            )}
                            <CardDeck
                                variant={false}
                                data={i}
                                onFavorite={() => onFavorite(i.id, i.isFavorite)}
                                status={i.isFavorite}
                            />
                        </div>
                    ))
                }
            </div>

        </div>
    )
}
export default ModalCategory
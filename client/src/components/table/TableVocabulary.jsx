import Option from "../ui/Option"

const TableVocabulary = ({ data, onEdit, onDelete }) => {
    return (
        <table className="w-full bg-white border-collapse border border-secondary-content">
            <thead className="bg-stone-100">
                <tr>
                    <th className="text-stone-400 py-2">ลำดับ</th>
                    <th className="text-stone-400 py-2">รูปภาพ</th>
                    <th className="text-stone-400 py-2">คำศัพท์</th>
                    <th className="text-stone-400 py-2">พินอิน</th>
                    <th className="text-stone-400 py-2">ความหมาย</th>
                    <th className="text-stone-400 py-2">จัดการ</th>
                </tr>
            </thead>
            <tbody>
                {
                    data?.map((i, idx) => (
                        <tr key={i.id} className="text-center">
                            <td className="text-stone-400 py-2">{idx + 1}</td>
                            <td className="py-2">
                                <div className="flex justify-center">
                                    <div className="w-12 h-12 overflow-clip rounded-sm">
                                        {i?.url ? <img src={i.url} alt={`image` + i.word} className="w-full h-full object-contain" /> : <div className="bg-stone-100 text-stone-400 text-xs text-center p-2">ไม่มีรูปภาพ</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="font-bold text-lg text-secondary py-2">{i.word}</td>
                            <td className="text-secondary text-lg py-2">{i.pinyin}</td>
                            <td className="text-secondary text-lg py-2">{i.meaning}</td>
                            <td ><div className="flex justify-center"><Option onDelete={() => onDelete(i.id)} onEdit={() => onEdit(i)} /></div></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
export default TableVocabulary
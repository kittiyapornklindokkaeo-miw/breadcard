import { AiOutlineDelete } from "react-icons/ai"
import Button from "../ui/Button"

const FormRemove = ({ type, onClose, onConfirm, isLoading, additional }) => {
    return (
        <div className="sm:w-sm flex flex-col items-center gap-3 font-itim">
            {/*ข้อความ*/}
            <div className="flex flex-col items-center">
                <AiOutlineDelete className="size-9 text-accent" />
                <h1 className="font-bold text-lg text-secondary">คุณต้องการจะลบ{type}นี้ ?</h1>
                <div className="px-5 text-center">
                    {additional ? <p className="text-stone-400">{additional}</p> : ''}
                </div>
            </div>
            {/*ปุ่ม*/}
            <div className="w-full space-y-3">
                <Button
                    type="submit"
                    onClick={onConfirm}
                    children="ลบ"
                    isLoading={isLoading}
                    variant="primary"
                    width="w-full"
                />
                <Button
                    type="button"
                    onClick={onClose}
                    children="ยกเลิก"
                    variant="outline"
                    width="w-full"
                />
            </div>
        </div>
    )
}
export default FormRemove
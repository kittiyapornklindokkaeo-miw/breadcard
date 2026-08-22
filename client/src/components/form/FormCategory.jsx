import { useUploadImage } from "../../hook/useUploadImage"
import Button from "../ui/Button"
import InputWithLabel from "../ui/InputWithLabel"
import UploadImage from "../ui/UploadImage"

const FormCategory = ({ type, form, setForm, error, isLoading, onChange, onSubmit, onClose }) => {
    const { isLoading: loadingImg, error: errImg, handleDelete, handleOnChange } = useUploadImage(form, setForm, "category")
    return (
        <form onSubmit={onSubmit} className="sm:w-sm space-y-7 font-itim text-secondary">
            <h1 className="font-bold text-xl">{type === 'create' ? '📂 สร้างหมวดหมู่ใหม่' : 'แก้ไขข้อมูลหมวดหมู่'}</h1>
            <div className="space-y-3">
                <UploadImage
                    form={form}
                    isLoading={loadingImg}
                    error={errImg}
                    onChange={handleOnChange}
                    onDelete={handleDelete}
                />
                <InputWithLabel
                    type="text"
                    title="ชื่อหมวดหมู่"
                    value={form?.category_name}
                    error={error?.category_name}
                    name="category_name"
                    style="w-full"
                    placeholder="หมวดหมู่..."
                    onChange={onChange}
                />
            </div>
            <div className="flex justify-end">
                <div className="flex gap-3">
                    <Button
                        type="button"
                        onClick={onClose}
                        children="ยกเลิก"
                        variant="outline"
                        width="w-full"
                    />
                    <Button
                        type="submit"
                        children="บันทึก"
                        isLoading={isLoading}
                        variant="secondary"
                        width="w-full"
                    />
                </div>
            </div>
        </form>
    )
}
export default FormCategory
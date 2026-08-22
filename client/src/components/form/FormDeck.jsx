import Button from "../ui/Button"
import Select from "../ui/Select"
import InputWithLabel from "../ui/InputWithLabel"

const FormDeck = ({ type, form, error, isLoading, category, onChange, onSubmit, onClose }) => {
    return (
        <form onSubmit={onSubmit} className="sm:w-sm space-y-7 font-itim text-secondary">
            <h1 className="font-bold text-xl">{type === 'create' ? '📒 สร้างชุดคำศัพท์ใหม่' : 'แก้ไขข้อมูลชุดคำศัพท์'}</h1>
            <div className="space-y-3">
                <Select form={form} data={category} onChange={onChange} />
                <InputWithLabel
                    type="text"
                    title="ชื่อชุดคำศัพท์"
                    value={form?.deck_name}
                    error={error?.deck_name}
                    name="deck_name"
                    style="w-full"
                    placeholder="ชื่อชุดคำศัพท์..."
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
export default FormDeck
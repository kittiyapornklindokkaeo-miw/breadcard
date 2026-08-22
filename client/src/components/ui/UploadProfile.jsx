import { IoCameraOutline } from "react-icons/io5";
import { LuCamera } from "react-icons/lu";

const UploadProfile = ({ onChange }) => {
    return (
        <div className="group bg-secondary/50 w-7 h-7 rounded-full hover:bg-secondary/65">
            <label htmlFor="upload-image" className="w-full h-full cursor-pointer flex justify-center items-center">
                <input
                    id="upload-image"
                    hidden
                    type="file"
                    accept="image/jpg, image/png"
                    onChange={onChange}
                />
                <LuCamera className="size-4 text-white" />
            </label>
        </div>
    )
}
export default UploadProfile
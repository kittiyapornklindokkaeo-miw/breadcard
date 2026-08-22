import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuLoaderCircle } from "react-icons/lu";

const UploadImage = ({ form, error, isLoading, onChange, onDelete }) => {
    return (
        <div>
            <div className="flex gap-3">
                {/*แสดงรูปภาพ*/}
                {
                    (isLoading || form?.url) && (
                        <div className="relative w-50 border border-secondary-content rounded-md overflow-clip">
                            {
                                isLoading ? (
                                    <div className="w-full h-full flex justify-center items-center">
                                        <LuLoaderCircle color='#F0EBE8' size={20} className='animate-spin mb-3' />
                                    </div>
                                ) : (
                                    <>
                                        <img src={form?.url} className="w-full h-full object-cover" />
                                        <button type="button" onClick={onDelete} className="absolute top-1 right-1 bg-stone-500/25 rounded-full p-1 hover:bg-stone-500/50">
                                            <FaXmark className="size-3 text-white" />
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    )
                }
                {/*อัปโหลดรูปาพ*/}
                <div className="group flex justify-center items-center p-5 w-full border-2 border-dashed border-secondary-content rounded-md">
                    <label htmlFor="upload-image" className="w-full h-full cursor-pointer">
                        <input
                            id="upload-image"
                            hidden
                            type="file"
                            accept="image/jpg, image/png"
                            onChange={onChange}
                        />
                        <div className="flex flex-col items-center">
                            <IoCloudUploadOutline className="size-7 text-stone-500 group-hover:text-stone-600" />
                            <p className="text-stone-500 group-hover:text-stone-600">อัปโหลดรูปภาพของคุณ</p>
                            <p className="text-xs text-stone-400"><span style={{ color: "#CB3535" }}>*</span> รองรับ jpg, png ขนาดไม่เกิน 1.5 mb</p>
                        </div>
                    </label>
                </div>
            </div>
            <p className="text-xs text-accent mt-1">{error}</p>
        </div>
    )
}
export default UploadImage
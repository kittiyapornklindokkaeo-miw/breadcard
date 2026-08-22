import { useState } from "react";
import { GoChevronDown } from "react-icons/go";

const Select = ({ form, onChange, data }) => {
    return (
        <div className="relative grid justify-items-start">
            <label htmlFor="category_id" className='mb-1 font-medium text-sm'>หมวดหมู่</label>
            <select
                id="category_id"
                name="category_id"
                value={form?.category_id ?? ''}
                onChange={onChange}
                className="w-full appearance-none text-sm px-3 py-2 border border-secondary-content rounded-md bg-white focus:outline-secondary"
            >
                <option value="" disabled={true}>โปรดเลือก</option>
                {data?.map((i) => (
                    <option value={i.id} key={i.id}>{i.category_name}</option>
                ))}

            </select>
            <GoChevronDown className="absolute top-9 right-3 pointer-events-none text-secondary" />
        </div>
    )
}
export default Select
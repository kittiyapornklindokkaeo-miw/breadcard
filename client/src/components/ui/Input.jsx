const Input = ({ value, title, name, type, suffix, onChange, error, style }) => {
    return (
        <div>
            <div className="relative w-full">
                <input
                    type={type}
                    value={value ?? ''}
                    name={name}
                    placeholder=" "
                    onChange={onChange}
                    className={`peer px-3 py-1 border border-secondary-content rounded-md bg-white focus:outline-secondary ${style}`}
                />
                <label className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-neutral-500 text-base
                transition-all duration-200 pointer-events-none
                peer-focus:top-0 peer-focus:text-sm peer-focus:text-secondary
                peer-focus:bg-white peer-focus:px-2
                peer-[:not(:placeholder-shown)]:top-0
                peer-[:not(:placeholder-shown)]:bg-white
                peer-[:not(:placeholder-shown)]:px-2
                peer-[:not(:placeholder-shown)]:text-sm
            ">
                    {title}
                </label>
                {suffix && (
                    <div className="absolute inset-y-0 right-2 flex items-center text-gray-500">
                        {suffix}
                    </div>
                )}
            </div>
            {error && (<span className="text-red-500 text-sm mt-1">{error}</span>)}
        </div>
    )
}
export default Input
const InputWithLabel = ({ value, title, name, placeholder, type, onChange, error, suffix, disabled }) => {
    return (
        <div className="grid justify-items-start">
            <label htmlFor="email" className='mb-1 font-medium text-sm'>
                {title}
            </label>
            <div className="relative w-full">
                <input
                    type={type}
                    disabled={disabled}
                    value={value ?? ''}
                    name={name}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full text-sm px-3 py-2 border border-secondary-content rounded-md bg-white focus:outline-secondary disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                />
                {suffix && (
                    <div className="absolute inset-y-0 right-2 flex items-center text-gray-500">
                        {suffix}
                    </div>
                )}
            </div>
            {error && (<p className="text-xs text-accent mt-1">{error}</p>)}
        </div>
    )
}
export default InputWithLabel
import { LuLoaderCircle } from "react-icons/lu"

const Button = ({ variant, children, onClick, isLoading, type, width, disabled }) => {
    const style = {
        primary: 'bg-accent text-white',
        secondary: 'bg-secondary text-white',
        outline: 'border border-secondary-content text-stone-500 hover:bg-stone-50 hover:text-secondary'
    }
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`px-6 py-2 rounded-lg font-medium ${style[variant]} ${width} ${isLoading ? 'w-full flex justify-center items-center' : ''} disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
        >
            {isLoading ? <LuLoaderCircle color='#F0EBE8' size={20} className='animate-spin' /> : children}
        </button>
    )
}
export default Button
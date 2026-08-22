import { useRef } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Carousel = ({ children, showControls = true }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({
            left: direction * scrollRef.current.clientWidth,
            behavior: "smooth",
        });
    };

    if (!showControls) return children;
    return (
        <div className="flex justify-between items-center gap-2">
            <button onClick={() => scroll(-1)} className="flex justify-center items-center w-7 h-7 rounded-full bg-stone-300/25 hover:bg-stone-300/50 shrink-0">
                <GoChevronLeft className="size-5 text-stone-400" />
            </button>
            <div ref={scrollRef} className="flex w-full gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
                {children}
            </div>
            <button onClick={() => scroll(1)} className="flex justify-center items-center w-7 h-7 rounded-full bg-stone-300/25 hover:bg-stone-300/50 shrink-0">
                <GoChevronRight className="size-5 text-stone-400" />
            </button>
        </div>
    )
}
export default Carousel
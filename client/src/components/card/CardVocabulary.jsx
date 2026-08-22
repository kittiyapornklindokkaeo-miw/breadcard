// import Flower1 from '../../assets/flower1.svg'
// import Flower2 from '../../assets/flower2.svg'
// import Flower3 from '../../assets/flower3.svg'
// import Flower4 from '../../assets/flower4.svg'
import Tail from '../../assets/tailbollune.svg'
import Flower1 from "../../assets/flower1.svg"
import Flower2 from "../../assets/flower2.svg"
import Flower3 from "../../assets/flower3.svg"
import Logo from "../../assets/logo_not_name_black.svg"
import LogoLeft from "../../assets/logo_left_eye.svg"

const CardVocabulary = ({ image, word, pinyin, answer, flip }) => {
    return (
        <div className="w-3xl h-90 perspective cursor-pointer">
            {/* กล่องภายในที่สามารถหมุนได้ */}
            <div className={`relative w-full h-full duration-500 transform-style preserve-3d transition-transform ${flip ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', }}
            >
                {/* ด้านหน้า */}
                <div className='backface-hidden absolute w-full h-full top-0 left-0' style={{ backfaceVisibility: 'hidden' }}>
                    <div className='flex flex-col justify-center bg-black w-3xl h-90 pr-17 rounded-3xl border-2 border-black font-main font-bold text-end text-white text-xl'>
                        <p>W</p>
                        <p>O</p>
                        <p>R</p>
                        <p>D</p>
                    </div>
                    <div className='absolute bottom-5 left-5 flex justify-center items-center bg-[#F7F2EB] w-150 h-80 rounded-2xl'>
                        {/* flower left */}
                        <img src={Flower1} className='absolute bottom-20 left-3 w-7' />
                        <img src={Flower2} className='absolute -bottom-2 left-20 w-9' />
                        <div className="absolute bottom-15 left-20 w-2 h-2 rounded-full bg-white border-[0.5px] border-secondary" />
                        <div className="absolute bottom-1 left-10 w-1 h-1 rounded-full bg-white border-[0.5px] border-secondary" />
                        <img src={Logo} className='absolute bottom-3 left-3 -rotate-5 w-15' />
                        {/* flower right */}
                        <img src={Flower3} className='absolute -top-10 right-10 w-17' />
                        <img src={Flower1} className='absolute top-15 right-3 w-5' />
                        <div className="absolute top-10 right-25 w-1 h-1 rounded-full bg-white border-[0.5px] border-secondary" />
                        <div className="absolute top-5 right-3 w-2 h-2 rounded-full bg-white border-[0.5px] border-secondary" />
                        <img src={LogoLeft} className='absolute top-9 right-10 rotate-7 w-10' />

                        <img src={Tail} className='absolute bottom-5 -right-12 size-15' />
                        <div className='flex flex-col items-center gap-5'>
                            {image && (
                                <div className="w-20 h-20 overflow-clip rounded-sm">
                                    <img src={image} className="w-full h-full object-contain" />
                                </div>
                            )}
                            <h1 className={`font-bold text-secondary ${image ? 'text-9xl' : 'text-[160px]'} font-livvic`}>{word}</h1>
                        </div>
                    </div>
                </div>
                {/* ด้านหลัง */}
                <div className='backface-hidden absolute w-full h-full top-0 left-0' style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                }}>
                    <div className='flex flex-col justify-center bg-black w-3xl h-90 pr-17 rounded-3xl border-2 border-black font-main font-bold text-end text-white text-xl'>
                        <p>W</p>
                        <p>O</p>
                        <p>R</p>
                        <p>D</p>
                    </div>
                    <div className='absolute bottom-5 left-5 flex justify-center items-center bg-[#F7F2EB] w-150 h-80 rounded-2xl'>
                        {/* flower left */}
                        <img src={Flower1} className='absolute bottom-20 left-3 w-7' />
                        <img src={Flower2} className='absolute -bottom-2 left-20 w-9' />
                        <div className="absolute bottom-15 left-20 w-2 h-2 rounded-full bg-white border-[0.5px] border-secondary" />
                        <div className="absolute bottom-1 left-10 w-1 h-1 rounded-full bg-white border-[0.5px] border-secondary" />
                        <img src={Logo} className='absolute bottom-3 left-3 -rotate-5 w-15' />
                        {/* flower right */}
                        <img src={Flower3} className='absolute -top-10 right-10 w-17' />
                        <img src={Flower1} className='absolute top-15 right-3 w-5' />
                        <div className="absolute top-10 right-25 w-1 h-1 rounded-full bg-white border-[0.5px] border-secondary" />
                        <div className="absolute top-5 right-3 w-2 h-2 rounded-full bg-white border-[0.5px] border-secondary" />
                        <img src={LogoLeft} className='absolute top-9 right-10 rotate-7 w-10' />

                        <img src={Tail} className='absolute bottom-5 -right-12 size-15' />
                        <div className='space-y-3 text-center'>
                            <h1 className='font-livvic font-bold text-secondary text-7xl'>{pinyin}</h1>
                            <h1 className='font-itim text-3xl text-secondary'>{answer}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CardVocabulary
import { Link, useRouteError } from "react-router"
import Image from "../assets/notfound.svg"

const ErrorPage = () => {
    const error = useRouteError()
    console.log(error)

    return (
        <div className="w-full h-screen bg-neutral grid justify-items-center place-content-center content-center gap-5 font-google">
            <img src={Image} width={150} height={150} />
            <h3 className="font-bold text-accent text-3xl">โอ๊ะ! เกิดข้อผิดพลาดบางอย่างขึ้น</h3>
            <p>เราไม่พบหน้าที่คุณกำลังมองหา
                ลองกลับไปที่<Link to='/' className="text-accent font-semibold">หน้าแรก</Link>ดูสิ</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}
export default ErrorPage
import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import { Outlet } from "react-router"

const Layout = () => {
    return (
        <div className="bg-neutral h-max px-20 lg:px-5">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
export default Layout
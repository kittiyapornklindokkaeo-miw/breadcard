import { Link } from 'react-router';
import Button from '../components/ui/Button';

const Forbidden = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='space-y-3 font-itim text-center'>
                <h1 className='text-accent text-7xl font-bold'>401</h1>
                <h3 className='text-xl text-secondary'>กรุณาลงชื่อเข้าใช้ก่อนเข้าใช้งานเว็บไซต์</h3>
                <Link to='/'>
                    <Button variant="secondary" type="button" children="กลับไปหน้าหลัก" />
                </Link>
            </div>
        </div>
    )
}
export default Forbidden
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from '../layout/Layout'
import Home from '../pages/Home'
import AboutUs from '../pages/Aboutus'
import RecoverPassword from '../pages/auth/RecoverPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import ErrorPage from '../pages/ErrorPage'
import LayoutUser from '../layout/LayoutUser'
import Category from '../pages/user/Category'
import Deck from '../pages/user/Deck'
import Favorite from '../pages/user/Favorite'
import ProtectedRoute from './ProtectedRoute'
import Forbidden from './Forbidden'
import Vocabulary from '../pages/user/Vocabulary'
import { AuthProvider } from '../context/AuthContext'
import PlayVocabulary from '../pages/user/PlayVocabulary'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path='/'
                        element={<Layout />}
                        errorElement={<ErrorPage />}
                    >
                        <Route index element={<Home />} />
                        <Route path='/about_us' element={<AboutUs />} />
                    </Route>
                    <Route path='recover_password' element={<RecoverPassword />} errorElement={<ErrorPage />} />
                    <Route path='reset_password' element={<ResetPassword />} errorElement={<ErrorPage />} />
                    <Route path='/forbidden' element={<Forbidden />} />

                    {/*user path*/}
                    <Route
                        path='/user'
                        element={<ProtectedRoute el={<LayoutUser />} />}
                        errorElement={<ErrorPage />}
                    >
                        <Route index element={<Favorite />} />
                        <Route path='category' element={<Category />} />
                        <Route path='deck' element={<Deck />} />
                        <Route path='deck/:id/vocabulary' element={<Vocabulary />} />
                    </Route>
                    <Route path='play-vocabulary/:id' element={<PlayVocabulary />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
export default AppRoutes
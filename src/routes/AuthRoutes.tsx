import {Route, Routes} from 'react-router-dom';
import Login from '../pages/Auth/Login';
import ForgetPassword from '../pages/Auth/ForgetPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import RegisterClient from '../pages/Auth/RegisterClient';
import RegisterUser from '../pages/Auth/RegisterUser';
import LoginClient from '../pages/Auth/LoginClient';

export default function AuthRoutes(){

    return(
        <Routes>
            <Route path='/' element={<Login/>}  />
            <Route path='/login' element={<Login/>}  />
            <Route path='/login/client' element={<LoginClient/>}  />
            <Route path='/forget-password' element={<ForgetPassword/>}  />
            <Route path='/reset-password' element={<ResetPassword/>}  />
            <Route path='/register-client' element={<RegisterClient/>}  />
            <Route path='/register-user' element={<RegisterUser/>}  />
            <Route path='/register' element={<RegisterUser/>}  />
        </Routes>
    )
}
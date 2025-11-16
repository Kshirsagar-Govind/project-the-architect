import {Route, Routes} from 'react-router-dom';
import Login from '../pages/Auth/Login';

export default function AuthRoutes(){

    return(
        <Routes>
            <Route path='/' element={<Login/>}  />
            <Route path='/auth/login' element={<Login/>}  />
        </Routes>
    )
}
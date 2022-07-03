import {useState, useContext} from "react";
import axios from 'axios';
import {toast} from 'react-toastify';
import {Modal} from 'antd';
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import {useRouter} from 'next/router';
import { UserContext } from "../context";

const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const [state, setState] = useContext(UserContext);

const router = useRouter();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const {data} = await axios.post(`/login`, {
            email,
            password,
        });

        if(data.error) {
            toast.error(data.error);
            setLoading(false);
        } else {
            setState({
                user:data.user,
                token:data.token,
            });
            // save in local storage
            localStorage.setItem("auth", JSON.stringify(data));
            router.push("/user/dashboard");
        }   
    } catch (error) {
        toast.error(error.response.data)
        setLoading(false);
    }
};

if (state && state.token) router.push('/user/dashboard');

    return (
    <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
            <div className='col text-center'>
                <h1 className="display-1 text-center py-5">
                    Login
                </h1>
            </div>
        </div>
            <div className='row py-5'>
                <div className="col-md-6 offset-md-3"> 
                    <AuthForm 
                        handleSubmit = {handleSubmit}
                        email = {email}
                        setEmail = {setEmail}
                        password = {password}
                        setPassword = {setPassword}
                        loading = {loading}
                        page="login"
                    />
                </div>
            </div>

            <div className="row">
                <div className = "col">
                    <p className="text-center"> 
                        Don't have an account? <br/> {" "}
                        <Link href="/register">
                            <a>Register now!</a>
                        </Link>
                    </p>
                </div>
            </div>
            <div>
                <p className="text-center"> 
                    <Link href="/forgot-password">
                        <a className="text-danger">Password recovery</a>
                    </Link>
                </p>
            </div>

    </div>
    );
};

export default Login


// const Login = () => {
//     return (
//     <div className="container">
//         <div className="row">
//             <div className='col'>
//                 <h1 className="display-1 text-center py-5">
//                     Login
//                 </h1>
//             </div>
//         </div>
//     </div>
//     );
// }

// export default Login
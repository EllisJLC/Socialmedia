import {useState, useContext} from "react";
import axios from 'axios';
import {toast} from 'react-toastify';
import {Modal} from 'antd';
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Register = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [security, setSecurity] = useState('');
const [ok, setOk] = useState(false);
const [loading, setLoading] = useState(false);

const [state] = useContext(UserContext);
const router = useRouter();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const {data} = await axios.post(`/register`,{ 
            name,
            email,
            password,
            security,
        });

        if(data.error) {
            toast.error(data.error);
            setLoading(false);
        } else {
            setName('')
            setEmail('')
            setPassword('')
            setSecurity('')
            setOk(data.ok);
            setLoading(false);
        }

    } catch (error) {
        // console.log(data.userName)
        toast.error(error.response.data)
        setLoading(false);
    }
};

if (state && state.token) router.push('/');

    return (
    <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
            <div className='col text-center'>
                <h1 className="display-1 text-center py-5">
                    Register
                </h1>
            </div>
        </div>
            <div className='row py-5'>
                <div className="col-md-6 offset-md-3"> 
                    <AuthForm 
                        handleSubmit = {handleSubmit}
                        name = {name}
                        setName = {setName}
                        password = {password}
                        setPassword = {setPassword}
                        email = {email}
                        setEmail = {setEmail}
                        security = {security}
                        setSecurity = {setSecurity}
                        loading = {loading}
                        page="register"
                    />
                </div>
            </div>
            <div className='row'>
                <div className = "col">
                    <Modal
                        title="Congratulations!"
                        visible={ok}
                        onCancel={() => setOk(false)}
                        footer={null}
                    >
                        <p>You have successfully registered!</p>    
                        <Link href="/login">
                            <a className="btn btn-primary btn-sm">Login</a>
                        </Link>
                    </Modal>
                </div>
            </div>

            <div className="row">
                <div className = "col">
                    <p className="text-center"> 
                        Already registered? <br/>{" "}
                        <Link href="/login">
                            <a>Log in!</a>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register
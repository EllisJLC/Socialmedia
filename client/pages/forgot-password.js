import {useState, useContext} from "react";
import axios from 'axios';
import {toast} from 'react-toastify';
import {Modal} from 'antd';
import Link from "next/link";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
const [email, setEmail] = useState('');
const [newPassword, setNewPassword] = useState('');
const [security, setSecurity] = useState('');
const [ok, setOk] = useState(false);
const [loading, setLoading] = useState(false);

const [state] = useContext(UserContext);
const router = useRouter();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const {data} = await axios.post(`/forgot-password`, {
            email,
            newPassword,
            security,
        });
        console.log('forgot pw response data =>', data);

        if (data.error) {
            toast.error(data.error);
            setLoading(false);
        };

        if (data.success) {
            setEmail("");
            setNewPassword("");
            setSecurity("");
            setOk(true);
            setLoading(true);
        }
    
    // setEmail('')
    // setNewPassword('')
    // setSecurity('')
    // setOk(data.ok);
    // setLoading(false);
    }
    catch (error) {
        console.log(error)
        setLoading(false);
    }
};

if (state && state.token) router.push('/');

    return (
    <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
            <div className='col text-center'>
                <h1 className="display-1 text-center py-5">
                    Password Recovery
                </h1>
            </div>
        </div>
            <div className='row py-5'>
                <div className="col-md-6 offset-md-3"> 
                    <ForgotPasswordForm
                        handleSubmit = {handleSubmit}
                        email = {email}
                        setEmail = {setEmail}
                        newPassword = {newPassword}
                        setNewPassword = {setNewPassword}
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
                        <p>Password has been changed.</p>    
                        <Link href="/login">
                            <a className="btn btn-primary btn-sm">Login</a>
                        </Link>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword
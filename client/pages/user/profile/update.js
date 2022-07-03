import {useState, useContext, useEffect} from "react";
import axios from 'axios';
import {toast} from 'react-toastify';
import {Modal, Avatar} from 'antd';
import Link from "next/link";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

const ProfileUpdate = () => {
    const [username, setUsername] = useState('');
    const [about, setAbout] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [security, setSecurity] = useState('');
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);
    
    //profile image
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);

    const [state, setState] = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (state&& state.user) {
            // console.log('user from state =>', state.user);
            setUsername(state.user.username);
            setAbout(state.user.about);
            setName(state.user.name);
            setEmail(state.user.email);
            setImage(state.user.image);
        }
    }, [state && state.user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const {data} = await axios.put(`/profile-update`,{ 
                name,
                username,
                about,
                password,
                security,
                image,
            });
            console.log('update response =>', data);
            if(data.error) {
                toast.error(data.error);
                setLoading(false);
            } else {
                //update local storage, update user, and keep token
                let auth = JSON.parse(localStorage.getItem('auth')); //pulls local storage info, user and token
                auth.user = data; //updates user data
                localStorage.setItem('auth', JSON.stringify(auth)); //replace user with new data
                //update context
                setState({...state, user: data});
                setOk(true);
                setLoading(false);
            }

        } catch (error) {
            // console.log(data.userName)
            toast.error(error.response.data)
            setLoading(false);
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append('image', file);
        // console.log([... formData]);
        setUploading(true);
        try {
            const {data} = await axios.post('/upload-image', formData);
            //console.log('uploaded image =>', data);
            setImage({
                url: data.url ,
                public_id: data.public_id,
            });
            setUploading(false);
        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    };

    return (
    <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
            <div className='col text-center'>
                <h1 className="display-1 text-center py-5">
                    Profile
                </h1>
            </div>
        </div>
            <div className='row py-5'>
                <div className="col-md-6 offset-md-3"> 

                {/*upload image*/}
                <label className="d-flex justify-content-center">
                    {
                        image && image.url ? (<Avatar size={30} src={image.url} className='mt-1'/>) :
                        uploading ? (<LoadingOutlined className="mt-2" style = {{fontSize:'30px'}}/>) :
                        (<CameraOutlined className="mt-2" style = {{fontSize:'30px'}}/>) 
                        // You can click the image uploaded to change the image to upload
                    }
                    <input onChange={handleImage} type='file' accept='images/*' hidden/> 
                </label>

                    <AuthForm 
                        handleSubmit = {handleSubmit}
                        name = {name}
                        setName = {setName}
                        email = {email}
                        setEmail = {setEmail}
                        password = {password}
                        setPassword = {setPassword}
                        security = {security}
                        setSecurity = {setSecurity}
                        username = {username}
                        setUsername = {setUsername}
                        about = {about}
                        setAbout = {setAbout}
                        loading = {loading}
                        page="update"
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
                        <p>You have updated your profile!!</p>    
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdate;
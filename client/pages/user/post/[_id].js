import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PostForm from "../../../components/forms/PostForm";
import UserRoute from "../../../components/routes/UserRoute";
import {toast} from 'react-toastify';

const EditPost = () => {
    const [post, setPost] = useState ({});
    // state
    const [content, setContent] = useState ('');
    const [image, setImage] = useState ({});
    const [uploading, setUploading] = useState (false);

    const router = useRouter();
    // console.log("router", router)
    const _id = router.query._id;

    useEffect(() => {
        if(_id) fetchPost();
    }, [_id]);

    const fetchPost = async() => {
        try {
            const {data} = await axios.get(`/user-post/${_id}`);
            setPost(data);
            setContent(data.content);
            setImage(data.image);
        } catch (error) {
            console.log(error)
        }
    };

    const postSubmit = async (e) => {
        e.preventDefault();
        try {
            const{data} = await axios.put(`/update-post/${_id}`, {content, image}); //axios.put for updating
            if(data.error) {
                toast.error(data.error)
            } else {
                toast.success('post has been updated!')
                router.push('/user/dashboard')
            }
        } catch (error){
            console.log(error)
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
        <UserRoute>    
        <div className='container-fluid'>
            <div className='col text-center'>
                <h1 className="display-1 text-center py-5">
                    Main page
                </h1>
            </div>

            <div className="row py-3">
                <div className="col-md-8 offset-md-2"> 
                <PostForm 
                    content={content} 
                    setContent={setContent} 
                    postSubmit={postSubmit}
                    handleImage={handleImage}
                    uploading={uploading}
                    image={image}
                />
                {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}

                </div>
            </div>
        </div>
    </UserRoute>
    );
};

export default EditPost
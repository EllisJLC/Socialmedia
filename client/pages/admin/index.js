import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import { useRouter, userRouter } from "next/router";
import axios from "axios";
import {toast} from "react-toastify";
import renderHTML from 'react-render-html';


const Admin = () => {
    const [state, setState] = useContext(UserContext);

    // Posts
    const [posts, setPosts] = useState([]);

    // route
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) {
            newsFeed();
        };
    }, [state && state.token]);

    const newsFeed = async () => {
        try {
            const { data } = await axios.get(`/posts`);
            // console.log("user posts =>", data);
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (post) => {
        try {
            const answer = window.confirm("Are you sure you would like to remove this post?")
            if (!answer)
                return;
            const {data} = await axios.delete(`/admin/delete-post/${post._id}`);
            toast.error("Post has successfully been deleted!");
            await newsFeed();
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AdminRoute>    
            <div className='container-fluid'>
                <div className="row py-5 text-light bg-default-image">
                    <div className='col text-center'>
                        <h1 className="display-1 text-center py-5">
                            Admin View
                        </h1>
                    </div>
                </div>
                <div className="row py-4">
                    <div className="col-md-8 offset-md-2">
                        {posts && 
                            posts.map(post => (
                                <div key={post._id}  className=' d-flex justify-content-between'> 
                                    <div>
                                        {renderHTML(post.content)} - <b>{post.postedBy.name}</b> {' '} 
                                    </div>
                                    <div className="text-danger" onClick={() => handleDelete(post)}>
                                        Delete
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </AdminRoute>
    );
};

export default Admin; 
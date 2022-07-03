import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import {toast} from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import CommentForm from "../../components/forms/CommentForm";
import Search from '../../components/search';
import io from 'socket.io-client';

const socket = io (
    process.env.NEXT_PUBLIC_SOCKETIO, 
    { path: '/socket.io' }, 
    {
        reconnection: true,
    }
);



const Home = () => {
    const [state, setState] = useContext(UserContext);

    //state
    const [content, setContent] = useState ('');
    const [image, setImage] = useState ({});
    const [uploading, setUploading] = useState (false); 
    const [loading, setLoading] = useState(false)

    // Posts
    const [posts, setPosts] = useState([]);

    // People
    const [people, setPeople] = useState([]);

    // Comments
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState('');

    //pagination
    const [totalPosts, setTotalPosts] = useState(0);
    const [page, setPage] = useState(1);

    // route
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) {
            newsFeed();
            findPeople();
        };
    }, [state && state.token, page]);

    useEffect(() => {
        if (state && state.token) {
        try {
            axios.get('/total-posts').then(({data}) => setTotalPosts(data));
        } catch (error) {
            console.log(error)
        }
    }}, []);

    const newsFeed = async () => {
        try {
            const { data } = await axios.get(`/news-feed/${page}`);
            // console.log("user posts =>", data);
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
    };

    const findPeople = async () => {
        try {
            const {data} = await axios.get('/find-people');
            setPeople(data);
        } catch (error) {
            console.log(error)
        }
    }
    const postSubmit = async (e) => {
        e.preventDefault()
        // console.log("post => ", content);
        try {
            const {data} = await axios.post('/create-post', {content, image});
            console.log('create post response', data);
            if (data.error) {
                toast.error(data.error);
            } else {
                newsFeed();
                setPage(1);
                toast.success("Your post has been created!");
                setContent('');
                setImage({});
                // socket
                socket.emit('new-post', data);
            }
        } catch (error) {
            console.log(error);
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

    const handleDelete = async (post) => {
        try {
            const answer = window.confirm("Are you sure you would like to remove this post?")
            if (!answer)
                return;
            const {data} = await axios.delete(`/delete-post/${post._id}`);
            toast.error("Post has successfully been deleted!");
            await newsFeed();
            
        } catch (error) {
            console.log(error);
        }
    };


    const handleFollow = async (user) => {
        // console.log('add this user to the following list', user);
        try {
            const {data} = await axios.put('/user-follow', {_id: user._id});
            // console.log('handle follow response =>', data);
            // update local storage, user, but keep token
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));
            //update context
            setState({...state, user: data});
            // update people state
            let filtered = people.filter((person) => person._id !== user._id);
            setPeople(filtered);
            // rerender posts
            toast.success(`Following ${user.name}`)
            newsFeed();
        } catch (error){
            console.log(error);
        };
    };

    const handleLike = async (_id) => {
        // console.log('liked', _id);
        try {
            const {data} = await axios.put('/like-post', {_id});
            // console.log('liked', data);
            newsFeed();
        } catch (error) {
            console.log(error);
        };
    };
    
    const handleUnlike = async (_id) => {
        try {
            const {data} = await axios.put('/unlike-post', {_id});
            // console.log('unliked', data);
            newsFeed();
        } catch (error) {
            console.log(error);
        };
    };
    
    const handleComment = (post) => {
        setCurrentPost(post);
        setVisible(true);
    };

    const addComment = async (e) =>{
        e.preventDefault();
        // console.log('add comment to the post', currentPost._id);
        // console.log('save comment to db', comment);
        try {
            const {data} = await axios.put('/add-comment', {
                postId: currentPost._id,
                comment,
            });
            console.log('adding comment', data);
            setComment('');
            setVisible(false);
            newsFeed();
        } catch (error) {
            console.log(error);
        }
    };
    const removeComment = async (postId, comment) => {
        // console.log(postId, comment)
        let answer = window.confirm('Remove this comment?');
        if(!answer) return;
        try {
            const {data} = await axios.put('/remove-comment', {
                postId, 
                comment
            });
            console.log('Comment removed', data);
            newsFeed();
        } catch (error) {
            console.log(error);
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
                    <div className="col-md-8"> 
                    <PostForm 
                        content={content} 
                        setContent={setContent} 
                        postSubmit={postSubmit}
                        handleImage={handleImage}
                        uploading={uploading}
                        image={image}
                    />
                    <br/>
                    <PostList 
                        posts={posts} 
                        handleDelete= {handleDelete}
                        loading = {loading}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                        handleComment={handleComment}
                        removeComment = {removeComment}
                    />

                    <Pagination 
                        current={page} 
                        total={Math.round(totalPosts/3)*10} 
                        onChange={(value) => setPage(value)} 
                    />
                    
                    </div>
                    <div className="col-md-4">
                        <Search/>
                        <br/>
                        {state && state.user && state.user.following && <Link href={'/user/following'}>
                            <a className="h6">
                                {state.user.following.length} Following
                            </a>
                        </Link>}
                    <People people={people} handleFollow={handleFollow}/>
                    </div>
                </div>

                <Modal
                    visible={visible} 
                    onCancel={() => setVisible(false)} 
                    title='comment'
                    footer={null}
                >
                <CommentForm 
                    comment={comment} 
                    setComment={setComment} 
                    addComment={addComment}
                />
                </Modal>
            </div>
        </UserRoute>
    );
};

export default Home; 
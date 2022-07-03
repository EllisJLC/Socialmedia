import { useContext } from 'react';
import {UserContext} from '../../context';
import { useRouter } from 'next/router';
import Post from '../../components/cards/Post';

const PostList = ({ 
    posts, 
    handleDelete, 
    handleLike, 
    handleUnlike, 
    handleComment,
    removeComment,
}) => {
    const [state] = useContext(UserContext);
    const router = useRouter();
    return (
    <>
        {posts &&
            posts.map((post) => <Post 
            post={post} 
            key={post._id}
            handleDelete = {handleDelete} 
            handleLike = {handleLike} 
            handleUnlike = {handleUnlike}
            handleComment = {handleComment} 
            removeComment = {removeComment}
        /> )}
    </>
    );
};

export default PostList;
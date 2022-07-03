import { useContext } from 'react';
import renderHTML from 'react-render-html';
import moment from "moment";
import { Avatar } from 'antd';
import PostImage from '../images/PostImage';
import {
    HeartOutlined, 
    HeartFilled, 
    CommentOutlined, 
} from '@ant-design/icons';
import {UserContext} from '../../context';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { imageSource } from '../../functions';

const PublicPost = ({ 
    post, 
}) => {
    const [state] = useContext(UserContext);
    const router = useRouter();
    
    return (
    <>
        {post && post.postedBy && (
        <div key={post._id} className="card mb-5">
            <div className="card-header">
                <div>
                    <Avatar size={40} className='mb-2' src={imageSource(post.postedBy)}/>
                    <span className='pt-2 ml-3' style={{marginLeft:'1rem'}}>
                        <b>{post.postedBy.name}</b>
                    </span>
                    <span className='pt-2 ml-3' style={{marginLeft:'1rem'}}>{moment(post.createdAt).fromNow()}</span>
                </div>
            </div>

            <div className="card-body">
                {renderHTML(post.content)}
            </div>

            <div className="card-footer">
                {post.image && (<PostImage url={post.image.url}/>)}
                <div className='d-flex pt-2'>
                    
                    {state && state.user && post.likes && post.likes.includes(state.user._id)? (
                        <HeartFilled
                            className = "text-danger pt-2 h5 px-2"
                        />
                    ) : (
                        <HeartOutlined
                            className = "text-danger pt-2 h5 px-2"
                        />
                    )}
                    
                    {post.likes.length == 1 ? (
                        <div className='pt-2 px-3'>{post.likes.length} Like</div>) : (
                        <div className='pt-2 px-3'>{post.likes.length} Likes</div>)
                    }
                    <CommentOutlined 
                        className='text-danger pt-1 h2 px-2'
                    />
                        {post.comments.length == 1 ? (
                            <div className='pt-2 px-3'>{post.comments.length} Comment</div>) : (
                            <div className='pt-2 px-3'>{post.comments.length} Comments</div>)
                        }
                </div>
            </div>
            {/*2 comments */}
            {post.comments && post.comments.length > 0 && (
                <ol 
                    className='list-group' 
                    style={{maxHeight: '125px', overflow:'scroll'}}
                >
                    {post.comments.slice(0).map((c)=> (
                      <li key={c._id} className='list-group-item d-flex justify-content-between align-items-start'>
                        <div className='ms-2 me-auto'>
                            <div className='fw-bold'>
                                <Avatar 
                                size={20}  
                                className='mb-1 mr-3' 
                                src={c.postedBy.image ? (c.postedBy.image.url) : ('/images/Blank_PFP.jpg')}
                                />
                                {"   " + c.postedBy.name}
                            </div>
                            <div> {c.text}</div>
                        </div>
                        <span className='badge round-pill text-muted'>
                            {moment(c.created).fromNow()}
                        </span>
                    </li>  
                    ))}
                </ol>
            )}
        </div>)}
    </>
    );
};

export default PublicPost;
import { useContext } from 'react';
import renderHTML from 'react-render-html';
import moment from "moment";
import { Avatar } from 'antd';
import PostImage from '../images/PostImage';
import {
    HeartOutlined, 
    HeartFilled, 
    CommentOutlined, 
    EditOutlined, 
    DeleteOutlined
} from '@ant-design/icons';
import {UserContext} from '../../context';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { imageSource } from '../../functions';

const Post = ({ 
    post, 
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
                            onClick = {() => handleUnlike(post._id)}
                            className = "text-danger pt-2 h5 px-2"
                        />
                    ) : (
                        <HeartOutlined
                            onClick = {() => handleLike(post._id)}
                            className = "text-danger pt-2 h5 px-2"
                        />
                    )}
                    
                    {post.likes.length == 1 ? (
                        <div className='pt-2 px-2'>{post.likes.length} Like</div>) : (
                        <div className='pt-2 px-2'>{post.likes.length} Likes</div>)
                    }
                    <CommentOutlined 
                        onClick={() => handleComment(post)} 
                        className='text-danger pt-2 h5 px-2'
                    />

                    <div className='pt-2 pl3'>
                        <Link href={`/post/${post._id}`}>
                            <a>
                                {post.comments.length == 1 ? (
                                    <div className='pt-1 px-2'>{post.comments.length} Comment</div>) : (
                                    <div className='pt-1 px-2'>{post.comments.length} Comments</div>)
                                }
                            </a>
                        </Link>
                    </div>
                    
                    {state && state.user && state.user._id === post.postedBy._id && (
                        <>
                            <div className='d-flex justify-content-end'>
                                <EditOutlined onClick={() => router.push(`/user/post/${post._id}`)} className='text-danger pt-1 h2 px-6'/>
                                <DeleteOutlined onClick={() => handleDelete(post)} className='text-danger pt-1 h2 px-2'/>
                            </div>
                        </>
                    )} 
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
                            {state && state.user && state.user._id === c.postedBy._id && (
                                <div className='ml-auto mt-1'>
                                    <DeleteOutlined 
                                        className='pl-2 text-danger'
                                        onClick={() => removeComment(post._id, c)}
                                    />
                                </div>
                            )}
                        </span>
                    </li>  
                    ))}
                </ol>
            )}
        </div>)}
    </>
    );
};

export default Post;
import { Avatar } from "antd";
import dynamic from 'next/dynamic'; //using dynamic import to import quill
const ReactQuill = dynamic (() => import("react-quill"), {ssr: false}); 
import {CameraOutlined, LoadingOutlined} from "@ant-design/icons";
//import ReactQuill from 'react-quill'; //only supported in client, not in server
import "react-quill/dist/quill.snow.css";

const PostForm = ({content, setContent, postSubmit, handleImage, uploading, image}) => { 
    return (
        <div className="card">
            <div className="card-body pb-3">
                <form className="form-group">
                    <ReactQuill
                        theme="snow"
                        value={content} 
                        onChange={(e) => setContent(e)} // for rich text, can remove don't need e.target.value
                        className="form-control" 
                        placeholder="Post here."
                    />
                </form>
            </div>

            <div className="card-footer d-flex justify-content-between text-muted">
                <button 
                disabled={!content}
                onClick={postSubmit} 
                className="btn btn-primary mt-1 btn-small"
                >
                    Post
                </button>

                <label>
                    {
                        image && image.url ? (<Avatar size={30} src={image.url} className='mt-1'/>) :
                        uploading ? (<LoadingOutlined className="mt-2" style = {{fontSize:'30px'}}/>) :
                        (<CameraOutlined className="mt-2" style = {{fontSize:'30px'}}/>) 
                        // You can click the image uploaded to change the image to upload
                    }
                    <input onChange={handleImage} type='file' accept='images/*' hidden/> 
                </label>
            </div>
        </div>
    );
};

export default PostForm;
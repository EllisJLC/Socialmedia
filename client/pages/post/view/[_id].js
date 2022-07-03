import ParallaxBG from "../../../components/cards/ParllaxBG";
import axios from "axios";
import PublicPost from '../../../components/cards/PublicPost'
import Head from 'next/head';

const SinglePost = ({post}) => {

    const head = () => (
        <Head>
            <title>MERN Sample</title>
            <meta 
                name="description" 
                content={post.content}
            />

            <meta
                property="og: description"
                content="social network program"
            />
            
            <meta 
                property="og:type" 
                content="website"
            />

            <meta 
                property="og:site_name" 
                content="Social Network Test Site"
            />

            <meta 
                property="og:url" 
                content= {`http://merncamp.com/post/view/${post._id}`} 
            />

            <meta 
                property="og:image:secure_url" 
                content= {imageSource()}
            />

        </Head>
    );

    const imageSource = () => {
        if (post.image) {
            return post.image.url;
        } else {
            return '/images/default.jpg';
        }
    }
    

    return (
        <>
            {head()}
            {/* <ParallaxBG url="/images/default.jpg"/> */}
            <ParallaxBG url="/images/default.jpg"/>
            <div className="container">
                <div className="row pt-5">
                    <div className="col-md-8 offset-md-2">
                        <PublicPost key={post._id} post={post}/>
                    </div>
                </div>
            </div>
            {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
        </>
    );
};

export async function getServerSideProps(ctx) {
    const {data} = await axios.get(`/post/${ctx.params._id}`); 
    // console.log(data);
    return {
        props: {
            post: data,
        },
    };
};

export default SinglePost;
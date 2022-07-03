import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import ParallaxBG from "../components/cards/ParllaxBG";
import axios from "axios";
import PublicPost from '../components/cards/PublicPost'
import Head from 'next/head';
import Link from "next/link";
import io from 'socket.io-client';

const socket = io (
    process.env.NEXT_PUBLIC_SOCKETIO, 
    { path: '/socket.io' }, 
    {
        reconnection: true,
    }
);


const Home = ({posts}) => {
    const [state, setState] = useContext(UserContext);

    const [newsFeed, setNewsFeed] = useState([])

    // useEffect(() => {
    //     // console.log('SOCKETIO ON JOIN', socket);
    //     socket.on('receive-message', (newMessage) => {
    //         alert(newMessage);
    //     })
    // }, [])

    useEffect(() => {
        socket.on('new-post', (newPost) => {
            // rerender posts
            setNewsFeed([newPost, ...posts]);
        })
    }, [])

    const head = () => (
        <Head>
            <title>MERN Sample</title>
            <meta 
                name="description" 
                content="MERN stack SEO sample"
            />
            <meta
                property="og: description"
                content="social network program"
            />
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content="Social Network Test Site"/>
            <meta property="og:url" content="http://socialnet.com"/>
            <meta property="og:image:secure_url" content="http://socialnet.com/images/default.jpg"/>
        </Head>
    );

    const collection = newsFeed.length > 0 ? newsFeed : posts;

    return (
        <>
            {head()}
            {/* <ParallaxBG url="/images/default.jpg"/> */}
            <ParallaxBG url="/images/default.jpg"/>
            <div className="container">
                {/* <button onClick={()=>{
                    socket.emit('send-message', "test message");
                }}>
                    Send Message
                </button> */}
                <div className="row pt-5">
                    {posts.map((post) => (
                        <div key={collection._id} className="col-md-4">
                            <Link href={`/post/view/${post._id}`}>
                                <a>
                                    <PublicPost key={post._id} post={post}/>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
        </>
    );
};

export async function getServerSideProps() {
    const {data} = await axios.get('/posts');
    // console.log(data);
    return {
        props: {
            posts: data,
        },
    };
};

export default Home;
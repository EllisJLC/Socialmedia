import { useContext, useState, useEffect } from 'react';
import {Avatar, Card} from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { UserContext } from '../../context';
import axios from 'axios';
import {RollbackOutlined} from '@ant-design/icons';
import Link from 'next/link';

const {Meta} = Card; // <Card.Meta>

const Username = () => {
    const [state, setState] = useContext(UserContext);
    //state
    const [user, setUser] = useState({});

    const router = useRouter();

    useEffect(() => {
        if (router.query.username) fetchUser();
    }, [router.query.username]);

    const fetchUser = async() => {
        try {
            const {data} = await axios.get(`/user/${router.query.username}`);
            console.log('following list:', data);
            setUser(data);
        } catch (error) {
            console.log(error);
        }
    };

    const imageSource = (user) => {
        if(user.image) {
            return user.image.url
        }
        else {
            return "/images/Blank_PFP.jpg"
        };
    };

    return (
        <div className='row col-md-6 offset-md-3'>
            {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}
            <div className='pt-5 pb-5'>
                <Card hoverable cover={<img src={imageSource(user)} style={{width: '100px', height: '100px'}} alt={user.name}/>}>
                    <Meta title={user.name} description={user.about}/>

                    <p className='pt-2 text-muted'>
                        Joined {moment(user.createdAt).fromNow()}
                    </p>

                    <div className='d-flex justify-content-between'>
                        
                        {/* <span className='btn btn-sm'>
                            {user.followers && user.followers.length} Followers
                        </span> */}

                            {user.followers && user.followers.length!=1 ? (
                                <span className='btn btn-sm'> {user.followers && user.followers.length} Followers </span>) : (
                                <span className='btn btn-sm'> {user.followers && user.followers.length} Follower </span>
                            )}
                        
                    </div>

                    <div className='d-flex justify-content-between'>
                        <span className='btn btn-sm'>
                            Following {user.following && user.following.length}
                        </span>
                    </div>

                </Card>

                <Link href="/user/dashboard">
                    <a className='d-flex justify-content-center pt-5'>
                        <RollbackOutlined/>
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default Username;

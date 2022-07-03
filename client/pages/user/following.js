import { useContext, useState, useEffect } from 'react';
import {Avatar, List} from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { UserContext } from '../../context';
import axios from 'axios';
import {RollbackOutlined} from '@ant-design/icons';
import Link from 'next/link';

const Following = () => {
    const [state, setState] = useContext(UserContext);
    //state
    const [people, setPeople] = useState([]); // use to grab from backend
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) fetchFollowing();
    }, [state && state.token]);

    const fetchFollowing = async() => {
        try {
            const {data} = await axios.get('/user-following');
            console.log('following list:', data);
            setPeople(data);
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

    const handleUnfollow = async (user) => {
        try {
            const {data} = await axios.put('/user-unfollow', {_id: user._id});
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));
            //update context
            setState({...state, user: data});
            // update people state
            let filtered = people.filter((person) => person._id !== user._id);
            setPeople(filtered);
            // rerender posts
            toast.error(`Unfollowed ${user.name}`)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='row col-md-6 offset-md-3'>

            <Link href="/user/dashboard">
                <a className='d-flex justify-content-center pt-5'>
                    <RollbackOutlined/>
                </a>
            </Link>

            <List 
                itemLayout='horizontal' 
                dataSource={people} 
                renderItem={(user) => (
                    <List.Item>
                        <List.Item.Meta 
                        avatar ={<Avatar src={imageSource(user)}/>}
                        title={
                            <div className='d-flex justify-content-between'>
                                {user.name} 
                                <span  
                                    onClick = {() => handleUnfollow(user)}
                                    className='text-primary pointer'> 
                                    Unfollow
                                </span>
                            </div>
                        } 
                        />
                    </List.Item>
                )} 
            />
        </div>
    )
}

export default Following

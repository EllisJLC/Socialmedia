import {SyncOutlined} from '@ant-design/icons';
import ProfileUpdate from '../../pages/user/profile/update';


const emailreq = /[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.+[a-zA-Z0-9./]/;

const AuthForm = ({ //need to send from register.js and receive here
    handleSubmit,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    security,
    setSecurity,
    loading,
    page,
    username,
    setUsername,
    about,
    setAbout,
}) => (
    <form onSubmit={handleSubmit}>
        {(page === "register" || page === "update") && (<div className='form-group p-2'>
            <small><label className='text-muted'>Name</label></small>
            <input 
                value = {name}
                onChange = {(e) => setName(e.target.value)}
                type='text'
                className='form-control' 
                placeholder='Enter name'
            />
        </div>)}

        {page === "update" && (<div className='form-group p-2'>
            <small><label className='text-muted'>Username</label></small>
            <input 
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}
                type='text'
                className='form-control' 
                placeholder='Enter new username'
            />
        </div>)}

        {page === "update" && (<div className='form-group p-2'>
            <small><label className='text-muted'>About</label></small>
            <input 
                value = {about}
                onChange = {(e) => setAbout(e.target.value)}
                type='text'
                className='form-control' 
                placeholder='About you'
            />
        </div>)}

        <div className='form-group p-2'>
            <small><label className='text-muted'>Email address</label></small>
            <input 
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
            type='email'
            className='form-control' 
            placeholder='Enter email'
            disabled={page === 'update'}
            />
        </div>

        {page !== "update" && (<div className='form-group p-2'>
            <small><label className='text-muted'>Password</label></small>
            <input 
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            type='password'
            className='form-control' 
            placeholder='Enter password'
            />
        </div>)}

        {page === "register" && (<div className="form-group p-2">
            <small>
                <label className="text-muted"> Pick a security question </label>
            </small>
            <select className='form-control'>
                <option>What is your favourite colour?</option>
                <option>What was your first pet's name?</option>
                <option>Where is your dream vacation destination?</option>
            </select>
            <small className="form-text text-muted">
                You can use these questions to reset your password if you forget.
            </small>
            <div className="form-group">
                <input 
                value = {security}
                onChange = {(e) => setSecurity(e.target.value)}
                type="text" 
                className="form-control" 
                placeholder="Answer here"
                />
            </div>
        </div>)}
        <div className="form-group py-4">
            {page === "register" && (<button disabled={!name||!email||!security||!password||!emailreq.exec(email)||loading} className="btn btn-primary col-12">
                {loading ? <SyncOutlined /> : "Register"}
            </button>)}
            {page === "login" && (<button disabled={!email||!password||!emailreq.exec(email)||loading} className="btn btn-primary col-12">
                {loading ? <SyncOutlined /> : "Log in"}
            </button>)}
            {page === "update" && (<button disabled={!email||loading||!username} className="btn btn-primary col-12">
                {loading ? <SyncOutlined /> : "Update!"}
            </button>)}
            {page === "example, (to use the same button component for both pages)" && (<button
                disabled = {
                    page !== "login"
                    ? !email || !password 
                    : !name||!email||!password||!security
                }
                className="btn btn-primary col-12"
            >
                {loading ? <SyncOutlined spin className="py-1"/> : "submit"}
            </button>)}
        </div>
    </form>
)

export default AuthForm;
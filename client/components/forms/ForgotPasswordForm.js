import {SyncOutlined} from '@ant-design/icons';
import ForgotPassword from '../../pages/forgot-password';


const emailreq = /[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.+[a-zA-Z0-9./]/;

const ForgotPasswordForm = ({ //need to send from register.js and receive here
    handleSubmit,
    email,
    setEmail,
    newPassword,
    setNewPassword,
    security,
    setSecurity,
    loading,
    page,
}) => (
    <form onSubmit={handleSubmit}>
        <div className='form-group p-2'>
            <small><label className='text-muted'>Email address</label></small>
            <input 
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
            type='email'
            className='form-control' 
            placeholder='Enter email'
            />
        </div>

        <div className='form-group p-2'>
            <small><label className='text-muted'>New password</label></small>
            <input 
            value = {newPassword}
            onChange = {(e) => setNewPassword(e.target.value)}
            type='password'
            className='form-control' 
            placeholder='Enter new password'
            />
        </div>
            <div className="form-group p-2">
            <small>
                <label className="text-muted"> Pick a security question </label>
            </small>
            <select className='form-control'>
                <option>What is your favourite colour?</option>
                <option>What was your first pet's name?</option>
                <option>Where is your dream vacation destination?</option>
            </select>
            <small className="form-text text-muted">
                Required to reset password
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
        </div>
        <div className="form-group py-4">
            <button
                disabled = {
                    !email || !newPassword || !security || loading
                }
                className="btn btn-primary col-12"
            >
                {loading ? <SyncOutlined spin className="py-1"/> : "submit"}
            </button>
        </div>
    </form>
)

export default ForgotPasswordForm;
const CommentForm = ({addComment, comment, setComment}) => {
    return (
        <form onSubmit={addComment}>
            <input 
                type="type" 
                className="form-control" 
                placeholder="Write your comment here!" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
            />
            <div className="py-3">
                <button className="btn btn-primary btn-sm btn-block">
                    Submit
                </button>
            </div>
        </form>
    )
}

export default CommentForm;
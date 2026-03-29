import React from 'react'
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div>
            <h3>Page Not Found!</h3>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
    )
}

export default NotFoundPage

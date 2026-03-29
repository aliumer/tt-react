import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className="jumbotron">
            <h1>Typing and Mouse Tutor.</h1>
            <p>For mouse practice click on Mouse link above.</p>
            <p>For typing tutor click on Typing link above.</p>
            <Link to="about" className="btn btn-primary">About</Link>
        </div>
    )
}

export default HomePage

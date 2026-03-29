import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
    const activeStyle = { color: "orange" };
    return (
        <nav>
            <NavLink to="/" exact activeStyle={activeStyle}>Home</NavLink> {" | "}
            <NavLink to="/typing" activeStyle={activeStyle}>Typing</NavLink> {" | "}
            <NavLink to="/mouse" activeStyle={activeStyle}>Mouse</NavLink>
        </nav>
    )
}

export default Header

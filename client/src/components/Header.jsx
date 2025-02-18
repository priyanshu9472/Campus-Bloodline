import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png';


export default function Header() {
    const location = useLocation();
    const [isLoginPage, setIsLoginPage] = useState(false); // State to control display of the sign in button

    useEffect(() => {
        if (location.pathname.includes("login")) {
            setIsLoginPage(true);
        } else setIsLoginPage(false);
    }, [location.pathname])

    return (
        <header className="bg-white shadow-sm">
            <nav className="navbar navbar-expand-lg navbar-light py-3">
                <div className="container">
                  <img src={logo} alt="logo" className="img-fluid mx-3" style={{width: "75px", height: "75px"}} />

                    <Link className="navbar-brand text-danger font-weight-bold" to="/"><b>St. Xavier's College of Management & Technology</b></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">Home</Link>
                            </li>

                        </ul>
                        {isLoginPage ? <></> :
                            <Link to="/login" className="btn btn-outline-danger ms-3">Sign In</Link>
                        }
                    </div>
                </div>
            </nav>
        </header>

    )
}



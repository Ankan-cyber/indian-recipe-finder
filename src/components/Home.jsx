import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Home = (props) => {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/?q=alooha', {
            method: "GET",
            headers: {
                "api-key": props.apiKey
            }
        })
    }, [props.apiKey])
    let header = {
        backgroundColor: "#f2f2f2",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        fontWeight: "600 !important",
        color: "#333"
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm === "") {
            toast.error('Empty field', {
                theme: "light",
                autoClose: 3000
            })
        }
        else {
            navigate(`/search?q=${searchTerm}`)
        }
    };

    return (
        <header className="container-fluid bg-light py-3" style={header}>
            <div className="row h-100">
                <div className="col-12 my-auto">
                    <h1 className="text-center font-weight-bold head">Indian Recipe Finder</h1>
                    <p className="text-center">Discover endless flavor with over 7000+ delicious recipes, just waiting to be found.</p>
                    <form className="mt-5 search-container" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="form-control search-bar"
                            placeholder="Search for recipes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" style={{ border: "none", outline: "none" }}><i
                            className="fas fa-search search-icon"
                        ></i></button>
                    </form>
                </div>
            </div>
        </header>
    )
}

export default Home

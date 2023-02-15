import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner'
import RecipeCard from './RecipeCard'

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHeader, setShowHeader] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://localhost:5000/?q=alooha', {
      method: "GET"
    })
  }, [])

  const handleSearch = () => {
    if (searchTerm === "") {
      toast.error('Empty field', {
        theme: "light",
        autoClose: 3000
      })
    }
    else {
      setShowHeader(false);
      fetchRecipes();
      setLoading(true);
    }
  };
  const BackToHomepage = () => {
    setShowHeader(true);
    setRecipes([])
  };

  let header = {
    backgroundColor: "#f2f2f2",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    transform: `translateY(${showHeader ? "0" : "-100%"})`,
    opacity: `${showHeader ? "1" : "0"}`,
    fontWeight: "600 !important",
    color: "#333"
  }

  const fetchRecipes = async () => {
    try {
      let data = await fetch(`https://localhost:5000/?q=${searchTerm}`, {
        method: "GET"
      })
      let parsedData = await data.json()
      setRecipes(parsedData.result)
      setLoading(false)

    } catch (err) {
      toast.error('Some error occured', {
        theme: "light",
        autoClose: 3000
      })
    }
  }

  const RenderRecipes = () => {
    return (
      <>
        {recipes.map((e) => {
          e.URL = e.URL.replace("http://", "https://");
          return (
            <div className='col-md-4' style={{ padding: '10px' }} key={e.Srno} >
              <RecipeCard title={e.RecipeName} ingredients={e.TranslatedIngredients} recipeUrl={e.URL} diet={e.Diet} cuisine={e.Cuisine} />
            </div>
          );
        })}
      </>
    );
  }


  return (
    <>
      {showHeader && (
        <header className="container-fluid bg-light py-3" style={header}>
          <div className="row h-100">
            <div className="col-12 my-auto">
              <h1 className="text-center font-weight-bold head">Indian Recipe Finder</h1>
              <p className="text-center">Discover endless flavor with over 7000+ delicious recipes, just waiting to be found.</p>
              <div className="mt-5 search-container">
                <input
                  type="text"
                  className="form-control search-bar"
                  placeholder="Search for recipes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <i
                  className="fas fa-search search-icon"
                  onClick={handleSearch}
                ></i>
              </div>
            </div>
          </div>
        </header>
      )}
      {!showHeader &&
        <>
          <div className="container mt-5">
            <i className="fas fa-arrow-left search-icon" onClick={BackToHomepage}></i>
            <h1 className="text-center">Search Results: {searchTerm}</h1>
          </div>
          {loading ? <Spinner /> :
            recipes.length === 0 ? <div className="container my-3"><h2 className='text-center'>No Result Found</h2></div> : <div className="container my-3">
              <div className="row my-3" key={Math.random() + 1}>
                {RenderRecipes()}
              </div>
            </div>
          }

        </>
      }
      <ToastContainer />
    </>
  );
}

export default App;

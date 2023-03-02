import { useEffect, useState } from "react"
import RecipeCard from './RecipeCard'
import Spinner from './Spinner'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import InfiniteScroll from 'react-infinite-scroller';
import Footer from "./Footer"

const SearchRecipes = (props) => {

    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)
    const [recipeEnd, setRecipeEnd] = useState(6)

    const fetchRecipes = async (q) => {
        try {
            let data = await fetch(`http://localhost:5000/?q=${q}`, {
                method: "GET",
                headers: {
                    "api-key": props.apiKey
                }
            })
            let parsedData = await data.json()
            if (parsedData.success) {
                setRecipes(parsedData.result)
            }
            else {
                toast.error('Some error occured', {
                    theme: "light",
                    autoClose: 3000
                })
            }
            setLoading(false)

        } catch (err) {
            toast.error('Some error occured', {
                theme: "light",
                autoClose: 3000
            })
        }
    }

    const handleNextClick = () => {
        if (page < Math.ceil(recipes.length / 6)) {
            setPage(page + 1)
            setRecipeEnd(recipeEnd + 6)
            RenderRecipes(0, recipeEnd)
        }
    }

    const RenderRecipes = (start, end) => {
        return (
            <>
                {recipes.slice(start, end).map((e) => {
                    e.URL = e.URL.replace("http://", "https://");
                    return (
                        <div className='col-md-4' style={{ padding: '10px' }} key={e.Srno} >
                            <RecipeCard title={e.RecipeName} ingredients={e.TranslatedIngredients} recipeUrl={e.URL} diet={e.Diet} cuisine={e.Cuisine} recipeWhole={e} />
                        </div>
                    );
                })}
            </>
        );
    }

    const BackToHomepage = () => {
        navigate('/')
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setQuery(searchParams.get("q"));
        let query = searchParams.get("q");
        fetchRecipes(query)
        //eslint-disable-next-line
    }, [])


    return (
        <>
            <div className="container mt-5">
                <i className="fas fa-arrow-left search-icon" onClick={BackToHomepage}></i>
                <h1 className="text-center">Search Results: {query}</h1>
            </div>
            {loading ? <Spinner /> :
                recipes.length === 0 ?
                    <div className="container my-3" style={{ height: "70vh" }}><h2 className='text-center'>No Result Found</h2></div> :
                    <div className="container my-3">
                        {
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={handleNextClick}
                                hasMore={Math.ceil(recipes.length / 6) === page ? false : true}
                                loader={<Spinner key={Math.floor(Math.random() * 51)} />}
                                threshold={-10}
                            >
                                <div className="row my-3" key={Math.random() + 1}>
                                    {RenderRecipes(0, recipeEnd)}
                                </div>
                            </InfiniteScroll>
                        }

                    </div>
            }
            <Footer />
        </>

    )
}

export default SearchRecipes

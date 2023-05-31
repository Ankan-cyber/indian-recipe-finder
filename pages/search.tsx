import { useState, useEffect, FormEvent, SetStateAction } from "react"
import RecipeCard from '../components/RecipeCard'
import Spinner from '../components/Spinner'
import InfiniteScroll from 'react-infinite-scroller';
import Footer from "../components/Footer"
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from "next/router";
import mongoose from 'mongoose'


interface PageProps {
    success: boolean,
    result: Object[],
    err?: unknown
}

const SearchRecipes: NextPage<PageProps> = ({ result, success }) => {

    const router = useRouter();
    const [filter, setFilter] = useState({ diet: '', cuisine: '', });
    const [diets, setDiets] = useState([])
    const [cuisines, setCuisines] = useState([])
    const [page, setPage] = useState(1)
    const [recipeEnd, setRecipeEnd] = useState(6)
    const { q } = router.query;


    const handleNextClick = () => {
        if (page < Math.ceil(result.length / 6)) {
            setPage(page + 1)
            setRecipeEnd(recipeEnd + 6)
            RenderRecipes(0, recipeEnd)
        }
    }

    useEffect(() => {
        const pagedata = localStorage.getItem('searchpage')
        if (pagedata) {
            window.scrollTo(0, parseInt(pagedata));
        }
        if (success) {
            const uniqueDiets = new Set();
            const uniqueCuisines = new Set();
            result.forEach((e: any) => {
                uniqueDiets.add(e.Diet);
                uniqueCuisines.add(e.Cuisine);
            });

            setDiets(Array.from(uniqueDiets) as SetStateAction<never[]>);
            setCuisines(Array.from(uniqueCuisines) as SetStateAction<never[]>);
        }
    }, [])

    const RenderRecipes = (start: number, end: number) => {
        return (
            <>
                {result.slice(start, end).map((e: any) => {
                    e.URL = e.URL.replace("http://", "https://");
                    const goto = () => {
                        let data = window.pageYOffset;
                        localStorage.setItem('searchpage', JSON.stringify(data));
                        router.push(`/recipe/${e._id}`)
                    }
                    return (
                        <div className='md:w-4/12 p-3' key={e.Srno} >
                            <RecipeCard title={e.RecipeName} ingredients={e.TranslatedIngredients} recipeUrl={e.URL} diet={e.Diet} cuisine={e.Cuisine} id={e._id} goto={goto} />
                        </div>
                    );
                })}
            </>
        );
    }

    const BackToHomepage = () => {
        router.push('..')
    }

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform filtering based on filter.diet and filter.cuisine
        // Update the filtered results accordingly
    };

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
                <i className="fas fa-arrow-left search-icon" onClick={BackToHomepage}></i>
                <h1 className="text-center text-3xl xl:text-4xl ">Search Results: {q}</h1>
            </div>

            <div className="mx-auto max-w-7xl px-3 pt-8 xl:px-12 xl:pt-12">
                <form onSubmit={handleFilterSubmit}>
                    <div className="flex items-center justify-center md:justify-end flex-wrap">
                        <div className="pr-2">
                            <label htmlFor="diet" className="font-semibold pr-1">Diet:</label>
                            <select
                                id="diet"
                                name="diet"
                                value={filter.diet}
                                onChange={handleFilterChange}
                                className="rounded-lg border-gray-300 focus:border-[#740606ba] focus:ring-[#740606ba] p-2"
                            >
                                {diets.map((diet, index) => {
                                    return <option value={diet} key={index}>{diet}</option>
                                })}
                            </select>
                        </div>

                        <div className="pr-2">
                            <label htmlFor="cuisine" className="font-semibold pr-1">Cuisine:</label>
                            <select
                                id="cuisine"
                                name="cuisine"
                                value={filter.cuisine}
                                onChange={handleFilterChange}
                                className="rounded-lg border-gray-300 focus:border-[#740606ba] focus:ring-[#740606ba] p-2"
                            >
                                {cuisines.map((cuisine, index) => {
                                    return <option value={cuisine} key={index}>{cuisine}</option>
                                })}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="py-2 px-4 sm:text-sm text-white bg-[#740606ba] rounded-lg hover:bg-[#740606e0]"
                        >
                            Apply Filters
                        </button>
                    </div>
                </form>
            </div>

            {result.length === 0 ?
                <div className="mx-auto max-w-7xl p-8 my-4 h-[70vh]"><h2 className='text-center text-2xl'>No Result Found</h2></div> :
                <div className="mx-auto max-w-7xl p-8 xl:p-12">
                    {
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleNextClick}
                            hasMore={Math.ceil(result.length / 6) === page ? false : true}
                            loader={<Spinner key={Math.floor(Math.random() * 51)} />}
                            threshold={-10}
                        >
                            <div className="flex flex-wrap justify-center my-4" key={Math.random() + 1}>
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

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    await mongoose.connect(process.env.MONGO_URI);
    const query: any = context.query.q;
    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    else {
        try {
            const db = mongoose.connection;
            db.on('error', () => {
                throw new Error('Connection error');
            });

            const result = await db.collection("recipe").find({ RecipeName: { $regex: new RegExp(query, "i") } }).toArray();
            return {
                props: {
                    success: true,
                    result: JSON.parse(JSON.stringify(result))
                },
            };
        }
        catch (err) {
            return {
                props: {
                    success: false,
                    err: err,
                    result: []
                },
            };
        }
    }
};

export default SearchRecipes


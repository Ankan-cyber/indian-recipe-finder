import { useState, useEffect, SetStateAction } from "react"
import RecipeCard from '../components/RecipeCard'
import Spinner from '../components/Spinner'
import InfiniteScroll from 'react-infinite-scroller';
import Footer from "../components/Footer"
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from "next/router";
import { SelectTag, SelectOption } from "../components/SelectTag";
import mongoose from 'mongoose';
import { motion } from 'framer-motion'

interface PageProps {
    success: boolean,
    result: Object[],
    err?: unknown
}

const SearchRecipes: NextPage<PageProps> = ({ result, success }) => {

    const router = useRouter();
    const [diets, setDiets] = useState<{ label: string, value: string }[]>([])
    const [cuisines, setCuisines] = useState<{ label: string, value: string }[]>([])
    const [dietfilter, setDietfilter] = useState<SelectOption[]>([]);
    const [cuisinefilter, setCuisinefilter] = useState<SelectOption[]>([]);
    const [page, setPage] = useState(0)
    const [recipeEnd, setRecipeEnd] = useState(6)
    const { q } = router.query;


    useEffect(() => {
        const pagedata = localStorage.getItem('searchpage')
        if (pagedata) {
            window.scrollTo(0, parseInt(pagedata));
        }
        if (success) {
            const uniqueDiets: Set<string> = new Set();
            const uniqueCuisines: Set<string> = new Set();
            result.forEach((e: any) => {
                uniqueDiets.add(e.Diet);
                uniqueCuisines.add(e.Cuisine);
            });
            const dietObjects = Array.from(uniqueDiets, (diet) => ({
                label: diet,
                value: diet,
            }));
            const cuisineObjects = Array.from(uniqueCuisines, (cuisine) => ({
                label: cuisine,
                value: cuisine,
            }));
            setDiets(dietObjects as SetStateAction<{ label: string; value: string; }[]>);
            setCuisines(cuisineObjects as SetStateAction<{ label: string; value: string; }[]>);
            const filter = localStorage.getItem('filter');
            if (filter) {
                setDietfilter(JSON.parse(filter).dietfilter)
                setCuisinefilter(JSON.parse(filter).cuisinefilter)
            }
        }
    }, [])


    const RenderRecipes = (start: number, end: number) => {
        let resultCopy = structuredClone(result)

        if (cuisinefilter.length > 0 || dietfilter.length > 0) {
            resultCopy = [];
            let cuisineLabel: any = cuisinefilter.map(e => { return e.label })
            let dietLabel: any = dietfilter.map(e => { return e.label })
            if (cuisinefilter.length > 0) {
                resultCopy = [...result.filter((recipe: any) => {
                    return cuisineLabel.includes(recipe.Cuisine)
                })]
            }
            if (dietfilter.length > 0) {
                resultCopy.length === 0 ?
                    resultCopy = [...result.filter((recipe: any) => {
                        return dietLabel.includes(recipe.Diet)
                    })]
                    : resultCopy = [...resultCopy.filter((recipe: any) => {
                        return dietLabel.includes(recipe.Diet)
                    })]
            }
        }

        const handleNextClick = () => {
            if (page < Math.ceil(resultCopy.length / 6)) {
                setPage(page + 1)
                setRecipeEnd(recipeEnd + 6)
                RenderRecipes(0, recipeEnd)
            }
        }

        return (
            <>
                {resultCopy.length === 0 ?
                    <motion.div
                        className="flex flex-wrap justify-center mt-7 h-[50vh]"
                        initial={{ opacity: 0.5, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className='text-center text-2xl'>No Result Found</h2>
                    </motion.div>
                    :
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleNextClick}
                        hasMore={Math.ceil(resultCopy.length / 6) != page}
                        loader={<Spinner key={Math.floor(Math.random() * 51)} />}
                        threshold={-10}
                    >
                        <div className="flex flex-wrap justify-center my-4" key={Math.random() + 1}>
                            {resultCopy.slice(start, end).map((e: any) => {
                                e.URL = e.URL.replace("http://", "https://");
                                const goto = () => {
                                    let data = window.pageYOffset;
                                    localStorage.setItem('searchpage', JSON.stringify(data));
                                    localStorage.setItem('filter', JSON.stringify({ dietfilter, cuisinefilter }))
                                    router.push(`/recipe/${e._id}`)
                                }
                                return (
                                    <motion.div
                                        className='md:w-4/12 p-3' key={e.Srno}
                                        initial={{ opacity: 0.5, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.7 }}
                                    >
                                        <RecipeCard title={e.RecipeName} ingredients={e.TranslatedIngredients} recipeUrl={e.URL} diet={e.Diet} cuisine={e.Cuisine} id={e._id} goto={goto} />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </InfiniteScroll>
                }
            </>
        );
    }

    const BackToHomepage = () => {
        router.push('..')
    }


    return (
        <motion.div
            initial={{ opacity: 0.5, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
                <i className="fas fa-arrow-left search-icon" onClick={BackToHomepage}></i>
                <h1 className="text-center text-3xl xl:text-4xl ">Search Results: {q}</h1>
            </div>

            {result.length === 0 ?
                <div className="mx-auto max-w-7xl p-8 my-4 h-[70vh]"><h2 className='text-center text-2xl'>No Result Found</h2></div> :
                <div className="mx-auto max-w-7xl p-8 xl:p-12">
                    <div className="flex gap-[1em] flex-wrap items-center justify-center md:justify-end">
                        <div>
                            <p className="text-base font-medium">Diet Filter:</p>
                            <SelectTag
                                multiple
                                options={diets}
                                value={dietfilter}
                                onChange={o => setDietfilter(o)}
                            />
                        </div>
                        <div>
                            <p className="text-base font-medium">Cuisine Filter:</p>
                            <SelectTag
                                multiple
                                options={cuisines}
                                value={cuisinefilter}
                                onChange={o => setCuisinefilter(o)}
                            />
                        </div>
                    </div>
                    {RenderRecipes(0, recipeEnd)}
                </div>
            }
            <Footer />
        </motion.div>

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
                    err: JSON.parse(JSON.stringify(err)),
                    result: []
                },
            };
        }
    }
};

export default SearchRecipes


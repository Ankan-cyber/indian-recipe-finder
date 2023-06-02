import { useState, useEffect, FormEvent, SetStateAction } from "react"
import RecipeCard from '../components/RecipeCard'
import Spinner from '../components/Spinner'
import InfiniteScroll from 'react-infinite-scroller';
import Footer from "../components/Footer"
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from "next/router";
import { SelectTag, SelectOption } from "../components/SelectTag";
import mongoose from 'mongoose';


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
    const [page, setPage] = useState(1)
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
            setDietfilter([dietObjects[0]])
            setCuisinefilter([cuisineObjects[0]])
        }
    }, [])

    const handleNextClick = () => {
        if (page < Math.ceil(result.length / 6)) {
            setPage(page + 1)
            setRecipeEnd(recipeEnd + 6)
            RenderRecipes(0, recipeEnd)
        }
    }

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

        return (
            <>
                {resultCopy.slice(start, end).map((e: any) => {
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


    return (
        <>
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
                    err: JSON.parse(JSON.stringify(err)),
                    result: []
                },
            };
        }
    }
};

export default SearchRecipes


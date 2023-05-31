import { useRouter } from "next/router"
import Head from "next/head";
import { GetServerSideProps } from 'next';
import Error from "next/error"
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import RecipeData from "@/components/RecipeData";
import Footer from "@/components/Footer";

interface PageProps {
    success: boolean,
    result?: RecipeData,
    err?: unknown
}

function Id(props: PageProps) {
    const router = useRouter();
    const { id } = router.query;

    let ingredientsAll = props.result?.TranslatedIngredients.split(",");
    let TranslatedInstructions = props.result?.TranslatedInstructions.split(".");
    TranslatedInstructions = TranslatedInstructions?.slice(0, TranslatedInstructions.length - 1)

    const BackToHomepage = () => {
        router.back();
    }
    if (props.err) {
        return <Error statusCode={404} />
    }
    else {
        return (
            <>
                <Head>
                    <title>{props.result?.RecipeName}</title>
                </Head>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
                    <i className="fas fa-arrow-left search-icon" onClick={BackToHomepage}></i>
                    <div className="max-w-4xl mx-auto py-8 px-4">
                        <h1 className="text-3xl font-bold mb-4">{props.result?.RecipeName}</h1>
                        <div className="mb-4">
                            <p className="text-lg">
                                Cuisine: <span className="font-semibold">{props.result?.Cuisine}</span>
                            </p>
                            <p className="text-lg">
                                Diet: <span className="font-semibold">{props.result?.Diet}</span>
                            </p>
                        </div>
                        <hr className="mb-4" />
                        <div className="flex items-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <p className="text-lg">
                                Servings: <span className="font-semibold">{props.result?.Servings}</span>
                            </p>
                        </div>
                        <div className="flex items-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            <p className="text-lg pr-4">
                                Prep Time: <span className="font-semibold">{props.result?.PrepTimeInMins} min</span>
                            </p>
                            <p className="text-lg pr-4">
                                Cook Time: <span className="font-semibold">{props.result?.CookTimeInMins} min</span>
                            </p>
                            <p className="text-lg">
                                Total Time: <span className="font-semibold">{props.result?.TotalTimeInMins} min</span>
                            </p>
                        </div>
                        <hr className="mb-4" />
                        <div>
                            <h3 className="text-xl font-bold mb-2">Ingredients</h3>
                            <ul className="list-disc pl-6">
                                {ingredientsAll?.map((ingredient, index) => (
                                    <li key={index} className="mb-1">
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <hr className="my-4" />
                        <div>
                            <h3 className="text-xl font-bold mb-2">Instructions</h3>
                            <ol className="list-decimal pl-6">
                                {TranslatedInstructions?.map((instruction, index) => (
                                    <li key={index} className="mb-2">
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div >
                <Footer />
            </>
        )
    }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    await mongoose.connect(process.env.MONGO_URI);
    const id: any = context.params?.id;

    try {
        const db = mongoose.connection;
        db.on('error', () => {
            throw 'Connection error';
        });

        const recipe = await db.collection("recipe").findOne({ _id: new ObjectId(id) });
        return {
            props: {
                success: true,
                result: JSON.parse(JSON.stringify(recipe))
            },
        };
    }
    catch (err) {
        return {
            props: {
                success: false,
                err: JSON.parse(JSON.stringify(err)),
            },
        };
    }
    finally {
        await mongoose.disconnect()
    }
};
export default Id
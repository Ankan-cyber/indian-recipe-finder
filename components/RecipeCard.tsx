/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

type Recipe = {
    title: string,
    ingredients: string,
    recipeUrl: string,
    diet: string,
    cuisine: string,
    id: string,
    goto: () => void
}


function RecipeCard(props: Recipe) {
    const [imgUrl, setImgUrl] = useState<string>("");


    useEffect(() => {
        const fetchUrls = async () => {
            let imgUrl;
            if (localStorage.getItem(props.id) != null) {
                setImgUrl(localStorage.getItem(props.id) as string)
            }
            else {
                try {
                    const response = await fetch(props.recipeUrl)
                    const html = await response.text()
                    // Create a parser
                    let doc = new DOMParser().parseFromString(html, "text/html");

                    // Find the image with the class "img-thumbnail"
                    let img = doc.querySelector<HTMLImageElement>(".img-thumbnail");

                    // Get the src attribute of the image
                    let src = img?.getAttribute("src");

                    imgUrl = `https://archanaskitchen.com${src}`
                } catch (error) {
                    imgUrl = '/default.png'
                }
                setImgUrl(imgUrl);
                localStorage.setItem(props.id, imgUrl)
            }
        };
        fetchUrls();

        //eslint-disable-next-line
    }, [])


    let { title, ingredients, diet, cuisine, id } = props;
    ingredients = ingredients.slice(0, 150);


    return (
        <>
            <div className="max-w-sm bg-white border border-gray-300 rounded-xl shadow-md z-0" id="card">
                <div id="outter">
                    <img src={imgUrl} alt="..." className="rounded-t-xl w-[100%] h-[100%] absolute object-cover" />
                </div>
                <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
                    <p className="mb-3 font-normal text-gray-700">Ingredients: {ingredients}...</p>
                    <p className="mb-3 font-normal text-gray-700"><small className="text-gray-500"> Diet: {diet}<br />Cuisine: {cuisine}</small></p>
                    <button onClick={props.goto} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#740606ba] rounded-lg hover:bg-[#740606e0] focus:ring-4 focus:outline-none focus:ring-blue-300">Read More</button>
                </div>
            </div>
        </>
    )
}
export default RecipeCard
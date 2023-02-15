import { useEffect, useState } from "react";

function RecipeCard(props) {
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        const fetchUrls = async () => {
            let imgUrl;
            try {
                const response = await fetch(props.recipeUrl)
                const html = await response.text()
                // Create a parser
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");

                // Find the image with the class "img-thumbnail"
                let img = doc.querySelector(".img-thumbnail");

                // Get the src attribute of the image
                let src = img.getAttribute("src");

                imgUrl = `https://archanaskitchen.com${src}`
            } catch (error) {
                console.error(error);
            }
            setImgUrl(imgUrl);
        };
        fetchUrls();
        //eslint-disable-next-line
    }, [])

    let { title, ingredients, recipeUrl, diet, cuisine } = props;
    ingredients = ingredients.slice(0, 150);

    return (
        <>
            <div className="card" >
                <div id="outter">
                    <img src={imgUrl} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} alt="..." />
                </div>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">Ingredients: {ingredients}...</p>
                    <p className="card-text"><small className="text-muted"> Diet: {diet}<br />Cuisine: {cuisine}</small></p>
                    <a href={recipeUrl} className="btn btn-outline-success btn-sm" target="_blank" rel='noreferrer'>Read More</a>
                </div>

            </div>
        </>
    )
}
export default RecipeCard
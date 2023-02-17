import { useEffect, useState } from "react";
import RecipeModal from "./RecipeModal";


function RecipeCard(props) {
    const [imgUrl, setImgUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);

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
                imgUrl = '/default.png'
            }
            setImgUrl(imgUrl);
        };
        fetchUrls();
        //eslint-disable-next-line
    }, [])


    let { title, ingredients, diet, cuisine, recipeWhole } = props;
    ingredients = ingredients.slice(0, 150);


    const onClick = () => {
        setCurrentRecipe(recipeWhole);
        setShowModal(true);
    }

    return (
        <>
            <div className="card" id="card">
                <div id="outter">
                    <img src={imgUrl} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} alt="..." />
                </div>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">Ingredients: {ingredients}...</p>
                    <p className="card-text"><small className="text-muted"> Diet: {diet}<br />Cuisine: {cuisine}</small></p>
                    <button onClick={onClick} className="btn btn-outline-success btn-sm">Read More</button>
                </div>
            </div>
            {showModal && (
                <RecipeModal
                    recipeWhole={currentRecipe}
                    onClose={() => setShowModal(false)}
                    show={showModal}
                />
            )}
        </>
    )
}
export default RecipeCard
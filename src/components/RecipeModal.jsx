import React, { useRef, useEffect } from 'react'

const RecipeModal = (props) => {

    const modalopen = useRef(null);
    useEffect(() => {
        modalopen.current.click();
    }, [])

    let ingredientsAll = props.recipeWhole.TranslatedIngredients.split(",");
    let TranslatedInstructions = props.recipeWhole.TranslatedInstructions.split(".");
    console.log(TranslatedInstructions)

    return (
        <>
            <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop" ref={modalopen}>
            </button>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" show={props.show ? "true" : "false"}>
                <div className="modal-dialog modal-dialog-scrollable modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">{props.recipeWhole.RecipeName}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.onClose}></button>
                        </div>
                        <div className="modal-body" id="modalbody">
                            <div className="row cuisineandcourse">
                                <div className="col-12">
                                    Cuisine: <span itemProp="recipeCuisine">{props.recipeWhole.Cuisine}</span>
                                </div>

                                <div className="col-12 ">
                                    Diet: <span itemProp="keywords">{props.recipeWhole.Diet}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="row RecipeServesTime">

                                <div className="col-md-1 col-2 clock-icon">
                                    <i className="fas fa-clock fa-2x" aria-hidden="true"></i>
                                </div>

                                <div className="col-md-2 col-3">
                                    <span itemProp="prepTime">
                                        Prep in <p>{props.recipeWhole.PrepTimeInMins} M</p>
                                    </span>
                                </div>

                                <div className="col-md-2 col-3">
                                    <span itemProp="cookTime">
                                        Cooks in <p>{props.recipeWhole.CookTimeInMins} M</p>
                                    </span>
                                </div>

                                <div className="col-md-2 col-3">
                                    <span itemProp="totalTime">
                                        Total in <p>{props.recipeWhole.TotalTimeInMins} M</p>
                                    </span>
                                </div>

                                <div className="col-md-1 col-md-offset-2 col-2 clock-icon">
                                    <i className="fas fa-duotone fa-utensils fa-2x" aria-hidden="true"></i>
                                </div>


                                <div className="col-md-2 col-4 recipeYield">
                                    <span itemProp="recipeYield">
                                        Makes: <p>{props.recipeWhole.Servings} Servings</p>
                                    </span>
                                </div>

                            </div>
                            <hr />
                            <div className="row recipeingredientsanddirections">
                                <div className="col-md-4 col-12 recipeingredients">
                                    <h4 className="ingredientstitle">Ingredients</h4>
                                    <ul className="list-unstyled" id="ingred">
                                        {ingredientsAll.map((e) => {
                                            return (
                                                <li key={Math.random()}>{e}</li>
                                            )
                                        })}
                                    </ul>
                                </div>

                                <div className="col-md-8 col-12 recipeinstructions">

                                    <div className="recipeinstructionstitle">
                                        <span style={{ verticalAlign: "inherit" }}>
                                            <h4 style={{ verticalAlign: "inherit" }}>How to make {props.recipeWhole.RecipeName}</h4>
                                            <ol>
                                                {TranslatedInstructions.slice(0, TranslatedInstructions.length - 1).map((e) => {
                                                    return (
                                                        <li key={Math.random()} className="mb-2">{e}</li>
                                                    )
                                                })}
                                            </ol>
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.onClose}>Close</button>
                            {/* <button type="button" className="btn btn-primary">Go To Article</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecipeModal
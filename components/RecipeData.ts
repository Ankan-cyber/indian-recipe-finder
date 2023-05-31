import { ObjectId } from "mongoose";

export default interface RecipeData {
    _id: ObjectId;
    Srno: number;
    RecipeName: string;
    TranslatedRecipeName: string;
    Ingredients: string;
    TranslatedIngredients: string;
    PrepTimeInMins: number;
    CookTimeInMins: number;
    TotalTimeInMins: number;
    Servings: number;
    Cuisine: string;
    Course: string;
    Diet: string;
    Instructions: string;
    TranslatedInstructions: string;
    URL: string;
}

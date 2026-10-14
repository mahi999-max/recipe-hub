import { serverMutation } from "./core"

export const addRecipe=async(newRecipe)=>{
    return serverMutation('/api/allFoods',newRecipe)
}
import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some 
 all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include 
 additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response 
 in markdown to make it easier to render to a web page
`
const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN)
/*console.log("HF Token:", import.meta.env.VITE_HF_ACCESS_TOKEN)*/
console.log("HF Token:", import.meta.env.VITE_HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        });

        console.log("🥣 HuggingFace Response:", response); // 🧠 LOG THIS

        // Safely check for content
        if (response && response.choices && response.choices.length > 0) {
            const recipe = response.choices[0]?.message?.content;
            if (!recipe || recipe.trim() === "") {
                return "**Oops! Got an empty recipe back. Try again.**";
            }
            return recipe;
        } else {
            return "**Hmm… I didn’t get a valid recipe back.**";
        }
    } catch (err) {
        console.error("getRecipeFromMistral error:", err);
        return "**Sorry, I couldn’t fetch a recipe right now. Please try again later.**";
    }
}



export async function getTweakedRecipe(previousRecipe, userPrompt) {
    const TWEAK_PROMPT = `
  You are a friendly AI chef. You previously gave a recipe to the user, and now they want you to revise or improve it.
  Respond clearly and warmly. Use markdown formatting.
  
  Here is the previous recipe:
  ${previousRecipe}
  
  Here's the user's request to tweak it:
  ${userPrompt}
  `;
  
    try {
      const response = await hf.chatCompletion({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          { role: "system", content: TWEAK_PROMPT }
        ],
        max_tokens: 1024,
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error("Tweak error:", err.message);
      return "Oops! Something went wrong while tweaking the recipe.";
    }
  }
  


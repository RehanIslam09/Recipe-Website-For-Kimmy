import React from "react";
import IngredientsList from "./components/IngredientsList";
import ClaudeRecipe from "./components/ClaudeRecipe";
import SavedRecipes from "./components/SavedRecipes.jsx";
import { getRecipeFromMistral, getTweakedRecipe } from "../ai.js";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [chatHistory, setChatHistory] = React.useState([]);
  const recipeSection = React.useRef(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [savedRecipes, setSavedRecipes] = React.useState(() => {
    const local = localStorage.getItem("savedRecipes");
    return local ? JSON.parse(local) : [];
  });
  const [recipeCategory, setRecipeCategory] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  React.useEffect(() => {
    if (chatHistory.length > 0 && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  async function getRecipe() {
    if (ingredients.length === 0) {
      setStatusMessage("Add some ingredients first, please!");
      return;
    }
    setStatusMessage("Stirring up something special just for you, my love... 💖");
    const recipeMarkdown = await getRecipeFromMistral(ingredients);

    setChatHistory([{ sender: "ai", message: recipeMarkdown }]);
    setStatusMessage("🌸Here’s your recipe, my love, straight from heart.🌸");
  }

  async function handleTweakRequest(userPrompt) {
    setChatHistory((prev) => [...prev, { sender: "user", message: userPrompt }]);
    setStatusMessage("Perfecting your recipe, just for you...");

    const response = await getTweakedRecipe(userPrompt);

    setChatHistory((prev) => [...prev, { sender: "ai", message: response }]);
    setStatusMessage("Here’s your updated recipe, darling. 💕");
  }

  function saveCurrentRecipe() {
    // Find the last AI message from chatHistory
    const lastAIMessage = [...chatHistory]
      .reverse()
      .find((msg) => msg.sender === "ai");

    if (lastAIMessage && !savedRecipes.some((r) => r.content === lastAIMessage.message)) {
      const newRecipe = {
        id: Date.now(),
        title: `Recipe ${savedRecipes.length + 1}`,
        content: lastAIMessage.message,
        category: recipeCategory || "Uncategorized",
      };
      setSavedRecipes((prev) => [...prev, newRecipe]);
      setRecipeCategory(""); // clear category input
      setStatusMessage("Recipe saved with love! 💾");
    } else {
      setStatusMessage("No recipe to save or recipe already saved.");
    }
  }

  function createNewRecipe() {
    setChatHistory([]);
    setRecipeCategory("");
    setStatusMessage("");
    setIngredients([]);
  }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient").trim();
    if (newIngredient) {
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    }
  }

  return (
    <main>
      <form
        action={addIngredient}
        className="add-ingredient-form"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addIngredient(formData);
          e.target.reset();
        }}
      >
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button type="submit">Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsList
          scrollRef={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
          statusMessage={statusMessage}
        />

      )}

      {chatHistory.length > 0 && (
        <>
          <ClaudeRecipe chatHistory={chatHistory} onTweakRequest={handleTweakRequest} />
          <input
            type="text"
            placeholder="Enter category (e.g. Cake, Dessert, etc.)"
            value={recipeCategory}
            onChange={(e) => setRecipeCategory(e.target.value)}
            style={{
              marginTop: "20px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontFamily: "Inter",
              width: "100%",
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={saveCurrentRecipe}
              style={{
                padding: "10px 20px",
                backgroundColor: "#b04a68",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Inter",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
              type="button"
            >
              💾 Save Recipe
            </button>

            <button
              onClick={createNewRecipe}
              style={{
                padding: "10px 20px",
                backgroundColor: "#c87584",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Inter",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
              type="button"
            >
              ➕ New Recipe
            </button>
          </div>
        </>
      )}

      {savedRecipes.length > 0 && (
        <SavedRecipes recipes={savedRecipes} setRecipes={setSavedRecipes} />
      )}
    </main>
  );
}

import React from "react";

export default function IngredientsList({ ingredients, getRecipe, statusMessage, scrollRef }) {
  const ingredientsListItems = ingredients.map((ingredient) => (
    <li key={ingredient}>{ingredient}</li>
  ));

  return (
    <section>
      <h2>Ingredients on hand:</h2>
      <ul className="ingredients-list" aria-live="polite">
        {ingredientsListItems}
      </ul>

      {ingredients.length > 3 && (
        <div className="get-recipe-container">
          <div ref={scrollRef}>
            <h3>{statusMessage ? statusMessage : "Ready for a recipe?"}</h3>
            {!statusMessage && <p>Generate a recipe from your list of ingredients.</p>}
          </div>
          <button onClick={getRecipe}>Get a recipe</button>
        </div>
      )}
    </section>
  );
}

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function SavedRecipes({ recipes, setRecipes }) {
  const [activeRecipeId, setActiveRecipeId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");

  function deleteRecipe(id) {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleExpand(id) {
    setActiveRecipeId((prev) => (prev === id ? null : id));
  }

  function renameRecipe(id) {
    const trimmedCategory = newCategory.trim() || "Uncategorized";
    const trimmedTitle = newTitle.trim() || "Untitled Recipe";

    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, title: trimmedTitle, category: trimmedCategory } : r
      )
    );
    setEditingId(null);
  }

  function groupByCategory(recipes) {
    return recipes.reduce((acc, recipe) => {
      const category = recipe.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(recipe);
      return acc;
    }, {});
  }

  const groupedRecipes = groupByCategory(recipes);

  return (
    <section>
      <h2
        style={{
          fontFamily: "Playfair Display, serif",
          color: "#7a2e3a",
          marginTop: "40px",
        }}
      >
        💌 Saved Recipes
      </h2>

      {/* Changed outer ul to div because inside we have multiple ul */}
      <div>
        {Object.entries(groupedRecipes).map(([category, groupedRecipes]) => (
          <div key={category} style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                color: "#b04a68",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              📂 {category}
            </h3>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {groupedRecipes.map((recipe) => (
                <li
                  key={recipe.id}
                  style={{
                    backgroundColor: "#fce6e5",
                    padding: "15px 20px",
                    borderRadius: "16px",
                    marginBottom: "15px",
                    boxShadow: "0 4px 10px rgba(80, 20, 40, 0.1)",
                    border: "1px solid #ecbfc4",
                  }}
                >
                  {editingId === recipe.id ? (
                    <div style={{ marginBottom: "10px" }}>
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="New name"
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          width: "70%",
                          marginRight: "8px",
                        }}
                      />
                      <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Category"
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          width: "70%",
                          marginTop: "10px",
                          marginRight: "8px",
                        }}
                      />
                      <button
                        onClick={() => renameRecipe(recipe.id)}
                        aria-label="Save renamed recipe"
                      >
                        💾 Save
                      </button>
                    </div>
                  ) : (
                    <h3
                      onClick={() => toggleExpand(recipe.id)}
                      style={{
                        cursor: "pointer",
                        color: "#802035",
                        fontFamily: "Playfair Display, serif",
                        marginBottom: "10px",
                      }}
                    >
                      {recipe.title}
                    </h3>
                  )}

                  {activeRecipeId === recipe.id && (
                    <div className="suggested-recipe-container">
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <h3 style={{ color: "#802035" }} {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h4 style={{ color: "#9b2d4d" }} {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li style={{ lineHeight: "1.6", color: "#7d4045" }} {...props} />
                          ),
                        }}
                      >
                        {recipe.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => {
                        setEditingId(recipe.id);
                        setNewTitle(recipe.title);
                        setNewCategory(recipe.category || "Uncategorized");
                      }}
                      style={{
                        marginRight: "8px",
                        backgroundColor: "#eaa9ad",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                      aria-label={`Rename recipe ${recipe.title}`}
                    >
                      ✏️ Rename
                    </button>
                    <button
                      onClick={() => deleteRecipe(recipe.id)}
                      style={{
                        backgroundColor: "#d86c6c",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                      aria-label={`Delete recipe ${recipe.title}`}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

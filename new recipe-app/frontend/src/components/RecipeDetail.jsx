import React, { useState } from 'react';

export default function RecipeDetail({ recipe, onBack, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="detail">
      <button className="btn btn--ghost" onClick={onBack}>&larr; Back to the box</button>

      <div className="detail-card">
        <div className="detail-card__header">
          {recipe.category && <span className="recipe-card__tag">{recipe.category}</span>}
          <h2>{recipe.title}</h2>
          {recipe.description && <p className="detail-card__desc">{recipe.description}</p>}
          <div className="detail-card__meta">
            {recipe.prepTimeMinutes != null && <span>Prep: {recipe.prepTimeMinutes} min</span>}
            {recipe.cookTimeMinutes != null && <span>Cook: {recipe.cookTimeMinutes} min</span>}
            {recipe.servings != null && <span>Serves: {recipe.servings}</span>}
          </div>
        </div>

        <div className="detail-card__body">
          <div className="detail-card__ingredients">
            <h3>Ingredients</h3>
            <ul>
              {(recipe.ingredients || []).map((ing) => (
                <li key={ing.id}>
                  <span className="qty">{ing.quantity}</span> {ing.name}
                </li>
              ))}
              {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                <li className="muted">No ingredients listed.</li>
              )}
            </ul>
          </div>

          <div className="detail-card__steps">
            <h3>Method</h3>
            <ol>
              {(recipe.steps || []).map((step, i) => <li key={i}>{step}</li>)}
              {(!recipe.steps || recipe.steps.length === 0) && (
                <li className="muted">No steps listed.</li>
              )}
            </ol>
          </div>
        </div>

        <div className="detail-card__actions">
          <button className="btn btn--secondary" onClick={onEdit}>Edit recipe</button>
          {!confirming ? (
            <button className="btn btn--danger" onClick={() => setConfirming(true)}>Delete</button>
          ) : (
            <span className="confirm-delete">
              Delete for good?
              <button className="btn btn--danger" onClick={onDelete}>Yes, delete</button>
              <button className="btn btn--ghost" onClick={() => setConfirming(false)}>Cancel</button>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];

export default function RecipeList({ recipes, loading, search, category, onSearchChange, onCategoryChange, onSelect, onCreate }) {
  return (
    <section>
      <div className="toolbar">
        <input
          className="input"
          type="text"
          placeholder="Search recipes…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          className="input input--select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && <p className="muted">Fetching recipe cards…</p>}

      {!loading && recipes.length === 0 && (
        <div className="empty-state">
          <p>No recipes here yet.</p>
          <button className="btn btn--primary" onClick={onCreate}>Add your first recipe</button>
        </div>
      )}

      <div className="card-grid">
        {recipes.map((r, i) => (
          <button
            key={r.id}
            className="recipe-card"
            style={{ '--tilt': `${(i % 3 - 1) * 1.2}deg` }}
            onClick={() => onSelect(r.id)}
          >
            <div className="recipe-card__hole" />
            {r.category && <span className="recipe-card__tag">{r.category}</span>}
            <h3>{r.title}</h3>
            {r.description && <p className="recipe-card__desc">{r.description}</p>}
            <div className="recipe-card__meta">
              {(r.prepTimeMinutes || r.cookTimeMinutes) && (
                <span>⏱ {(r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0)} min</span>
              )}
              {r.servings && <span>🍽 {r.servings} servings</span>}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

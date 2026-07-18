import React, { useEffect, useState, useCallback } from 'react';
import RecipeList from './components/RecipeList.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import RecipeForm from './components/RecipeForm.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } from './api.js';
import { isLoggedIn, getCurrentUser, logout } from './auth.js';
import './App.css';

// view: 'list' | 'detail' | 'create' | 'edit'
export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [user, setUser] = useState(getCurrentUser());
  const [view, setView] = useState('list');
  const [recipes, setRecipes] = useState([]);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState(null);

  const loadRecipes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipes(params);
      setRecipes(data);
    } catch (err) {
      setError('Could not reach the kitchen. Is the backend running on port 8080?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (authed) loadRecipes(); }, [authed, loadRecipes]);

  useEffect(() => {
    if (!authed) return;
    const handle = setTimeout(() => {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      loadRecipes(params);
    }, 300);
    return () => clearTimeout(handle);
  }, [search, category, authed, loadRecipes]);

  function flash(message) {
    setBanner(message);
    setTimeout(() => setBanner(null), 2500);
  }

  async function openDetail(id) {
    setError(null);
    try {
      const recipe = await getRecipe(id);
      setActiveRecipe(recipe);
      setView('detail');
    } catch (err) {
      setError('That recipe card could not be found.');
    }
  }

  function openCreate() {
    setActiveRecipe(null);
    setView('create');
  }

  function openEdit(recipe) {
    setActiveRecipe(recipe);
    setView('edit');
  }

  async function handleSave(recipeData) {
    try {
      if (activeRecipe && activeRecipe.id) {
        const updated = await updateRecipe(activeRecipe.id, recipeData);
        flash('Recipe updated.');
        setActiveRecipe(updated);
        setView('detail');
      } else {
        const created = await createRecipe(recipeData);
        flash('Recipe added to the box.');
        setActiveRecipe(created);
        setView('detail');
      }
      loadRecipes();
    } catch (err) {
      setError(err.message || 'Could not save this recipe.');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRecipe(id);
      flash('Recipe removed.');
      setView('list');
      setActiveRecipe(null);
      loadRecipes();
    } catch (err) {
      setError('Could not remove this recipe.');
    }
  }

  function handleLogout() {
    logout();
    setAuthed(false);
    setUser(null);
    setView('list');
    setActiveRecipe(null);
    setRecipes([]);
  }

  if (!authed) {
    return (
      <AuthScreen
        onAuthenticated={() => {
          setAuthed(true);
          setUser(getCurrentUser());
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__title" onClick={() => { setView('list'); setActiveRecipe(null); }}>
          <span className="app-header__mark">🍳</span>
          <div>
            <h1>The Recipe Box</h1>
            <p>your kitchen, catalogued</p>
          </div>
        </div>
        <div className="app-header__actions">
          {user && <span className="app-header__user">Hi, {user.name}</span>}
          {view !== 'create' && view !== 'edit' && (
            <button className="btn btn--primary" onClick={openCreate}>+ New recipe</button>
          )}
          <button className="btn btn--ghost" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {banner && <div className="banner">{banner}</div>}
      {error && <div className="banner banner--error">{error}</div>}

      <main className="app-main">
        {view === 'list' && (
          <RecipeList
            recipes={recipes}
            loading={loading}
            search={search}
            category={category}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onSelect={openDetail}
            onCreate={openCreate}
          />
        )}

        {view === 'detail' && activeRecipe && (
          <RecipeDetail
            recipe={activeRecipe}
            onBack={() => { setView('list'); setActiveRecipe(null); }}
            onEdit={() => openEdit(activeRecipe)}
            onDelete={() => handleDelete(activeRecipe.id)}
          />
        )}

        {(view === 'create' || view === 'edit') && (
          <RecipeForm
            initial={view === 'edit' ? activeRecipe : null}
            onCancel={() => setView(activeRecipe && view === 'edit' ? 'detail' : 'list')}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
}

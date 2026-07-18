import React, { useState } from 'react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
const emptyIngredient = () => ({ name: '', quantity: '' });

export default function RecipeForm({ initial, onCancel, onSave }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(initial?.category || 'Dinner');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(initial?.prepTimeMinutes ?? '');
  const [cookTimeMinutes, setCookTimeMinutes] = useState(initial?.cookTimeMinutes ?? '');
  const [servings, setServings] = useState(initial?.servings ?? '');
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.length ? initial.ingredients.map(i => ({ name: i.name, quantity: i.quantity })) : [emptyIngredient()]
  );
  const [steps, setSteps] = useState(initial?.steps?.length ? [...initial.steps] : ['']);
  const [formError, setFormError] = useState(null);

  function updateIngredient(index, field, value) {
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing));
  }

  function addIngredient() {
    setIngredients(prev => [...prev, emptyIngredient()]);
  }

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  function updateStep(index, value) {
    setSteps(prev => prev.map((s, i) => i === index ? value : s));
  }

  function addStep() {
    setSteps(prev => [...prev, '']);
  }

  function removeStep(index) {
    setSteps(prev => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('A recipe needs a title.');
      return;
    }
    const cleanIngredients = ingredients
      .filter(i => i.name.trim())
      .map(i => ({ name: i.name.trim(), quantity: i.quantity.trim() }));
    const cleanSteps = steps.map(s => s.trim()).filter(Boolean);

    setFormError(null);
    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      prepTimeMinutes: prepTimeMinutes === '' ? null : Number(prepTimeMinutes),
      cookTimeMinutes: cookTimeMinutes === '' ? null : Number(cookTimeMinutes),
      servings: servings === '' ? null : Number(servings),
      ingredients: cleanIngredients,
      steps: cleanSteps
    });
  }

  return (
    <section className="detail">
      <button className="btn btn--ghost" onClick={onCancel}>&larr; Cancel</button>

      <form className="detail-card form-card" onSubmit={handleSubmit}>
        <h2>{initial ? 'Edit recipe' : 'New recipe'}</h2>

        {formError && <div className="banner banner--error">{formError}</div>}

        <label className="field">
          <span>Title</span>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Grandma's lasagna" />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="A short note about this dish" />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Category</span>
            <select className="input input--select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Prep (min)</span>
            <input className="input" type="number" min="0" value={prepTimeMinutes} onChange={e => setPrepTimeMinutes(e.target.value)} />
          </label>
          <label className="field">
            <span>Cook (min)</span>
            <input className="input" type="number" min="0" value={cookTimeMinutes} onChange={e => setCookTimeMinutes(e.target.value)} />
          </label>
          <label className="field">
            <span>Servings</span>
            <input className="input" type="number" min="0" value={servings} onChange={e => setServings(e.target.value)} />
          </label>
        </div>

        <div className="field">
          <span>Ingredients</span>
          {ingredients.map((ing, i) => (
            <div className="ingredient-row" key={i}>
              <input
                className="input"
                placeholder="Amount (e.g. 2 cups)"
                value={ing.quantity}
                onChange={e => updateIngredient(i, 'quantity', e.target.value)}
              />
              <input
                className="input"
                placeholder="Ingredient"
                value={ing.name}
                onChange={e => updateIngredient(i, 'name', e.target.value)}
              />
              <button type="button" className="btn btn--ghost btn--icon" onClick={() => removeIngredient(i)} aria-label="Remove ingredient">✕</button>
            </div>
          ))}
          <button type="button" className="btn btn--secondary btn--small" onClick={addIngredient}>+ Add ingredient</button>
        </div>

        <div className="field">
          <span>Method</span>
          {steps.map((step, i) => (
            <div className="step-row" key={i}>
              <span className="step-row__num">{i + 1}</span>
              <textarea
                className="input"
                rows={2}
                placeholder="Describe this step"
                value={step}
                onChange={e => updateStep(i, e.target.value)}
              />
              <button type="button" className="btn btn--ghost btn--icon" onClick={() => removeStep(i)} aria-label="Remove step">✕</button>
            </div>
          ))}
          <button type="button" className="btn btn--secondary btn--small" onClick={addStep}>+ Add step</button>
        </div>

        <div className="detail-card__actions">
          <button type="submit" className="btn btn--primary">Save recipe</button>
          <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  );
}

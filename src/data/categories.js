import { CATEGORIES } from './initialData'

// Built-in categories plus any the admin has added (stored in the catalogue as state.categories).
export const allCategories = state => {
  const seen = new Set(CATEGORIES.map(c => c.id))
  return [...CATEGORIES.map(({ id, name }) => ({ id, name })), ...(state.categories || []).filter(c => !seen.has(c.id) && seen.add(c.id))]
}

export const categoryName = (state, id) => allCategories(state).find(c => c.id === id)?.name || id || 'Handmade'

export const slugify = name => name.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)

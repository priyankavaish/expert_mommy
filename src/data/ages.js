export const AGE_LABELS = {
  '0-6m': '0-6 months', '6-12m': '6-12 months',
  '1-2y': '1-2 years', '2-4y': '2-4 years', '4-6y': '4-6 years',
  '6-8y': '6-8 years', '8-10y': '8-10 years', '10-12y': '10-12 years',
  'teen': 'Teens', 'adult': 'Adults', 'all': 'All ages',
}

// ageGroup is a preset id, a custom label typed by the admin, or empty when age does not apply.
export const ageLabel = product => AGE_LABELS[product.ageGroup] || product.ageGroup?.trim() || ''

export const AGE_LABELS = {
  '0-6m': '0-6 months', '6-12m': '6-12 months',
  '1-2y': '1-2 years', '2-4y': '2-4 years', '4-6y': '4-6 years'
}
export const ageLabel = product => AGE_LABELS[product.ageGroup] || 'Ask us about sizing'

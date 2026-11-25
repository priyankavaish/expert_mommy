import { Fragment } from 'react'
import { useStore } from '../context/StoreContext'
import { defaultContent } from '../data/siteContent'

const FORMAT = /(\*\*[^*]+\*\*|\*[^*]+\*)/

// Renders saved text: new lines become <br/>, *text* italic, **text** bold.
export function Rich({ text = '' }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(FORMAT).map((part, j) => {
        if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) return <strong key={j}>{part.slice(2, -2)}</strong>
        if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <em key={j}>{part.slice(1, -1)}</em>
        return part
      })}
    </Fragment>
  ))
}

// Returns a lookup for a section's text, falling back to the built-in default.
export function useContent(section) {
  const { state } = useStore()
  return key => {
    const id = section + '.' + key
    return state.siteContent?.[id] ?? defaultContent[id] ?? ''
  }
}

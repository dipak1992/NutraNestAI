import Fuse from 'fuse.js'
import { HELP_ARTICLES } from './articles'

const fuse = new Fuse(HELP_ARTICLES, {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'description', weight: 2 },
    { name: 'body', weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

export function searchArticles(query: string) {
  if (!query.trim()) return []
  return fuse.search(query).slice(0, 8).map((r) => r.item)
}

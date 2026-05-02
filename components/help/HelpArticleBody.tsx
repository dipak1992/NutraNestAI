import type { HelpArticle } from '@/lib/help/types'

/**
 * Renders our simple markdown-lite body format.
 * - **bold** → <strong>
 * - lines starting with "# " → h3
 * - lines starting with "> " → blockquote
 * - lines starting with "- " → list items
 * - blank line → paragraph break
 */
export function HelpArticleBody({ article }: { article: HelpArticle }) {
  const blocks = article.body.split(/\n\n+/)

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
      {blocks.map((block, i) => {
        if (block.startsWith('# ')) {
          return (
            <h3
              key={i}
              className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50 mt-8 mb-3"
            >
              {block.slice(2)}
            </h3>
          )
        }
        if (block.startsWith('> ')) {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-[#D97757] pl-4 italic text-neutral-600 dark:text-neutral-400"
            >
              {block.slice(2)}
            </blockquote>
          )
        }
        // Check if block is a list (lines starting with "- " or numbered)
        const lines = block.split('\n')
        const isList = lines.every(
          (l) => l.startsWith('- ') || l.startsWith('* ') || /^\d+\.\s/.test(l)
        )
        if (isList && lines.length > 1) {
          const isOrdered = /^\d+\.\s/.test(lines[0])
          const Tag = isOrdered ? 'ol' : 'ul'
          return (
            <Tag
              key={i}
              className={`space-y-1.5 pl-5 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed ${
                isOrdered ? 'list-decimal' : 'list-disc'
              }`}
            >
              {lines.map((l, j) => (
                <li
                  key={j}
                  dangerouslySetInnerHTML={{
                    __html: renderInline(
                      l.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '')
                    ),
                  }}
                />
              ))}
            </Tag>
          )
        }
        return (
          <p
            key={i}
            className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderInline(block) }}
          />
        )
      })}
    </div>
  )
}

/**
 * Sanitize a URL to prevent javascript:/data:/vbscript: injection.
 * Only http: and https: protocols are allowed; anything else returns '#'.
 */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://mealeaseai.com')
    if (!['http:', 'https:'].includes(parsed.protocol)) return '#'
    return parsed.href
  } catch {
    return '#'
  }
}

function renderInline(text: string): string {
  // Bold **text**
  let out = text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-neutral-900 dark:text-neutral-100">$1</strong>'
  )
  // Italic *text*
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Inline links [text](url) — URL is sanitized to block javascript: and data: protocols
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, linkText: string, rawUrl: string) =>
      `<a href="${sanitizeUrl(rawUrl)}" rel="noopener noreferrer" class="text-[#D97757] underline underline-offset-2 hover:text-[#C86646]">${linkText}</a>`
  )
  // Newlines → <br>
  out = out.replace(/\n/g, '<br />')
  return out
}

import type { HelpArticle } from '@/lib/help/types'

/**
 * Renders our simple markdown-lite body format.
 * - **bold** → <strong>
 * - lines starting with "# " → h3
 * - lines starting with "> " → blockquote
 * - lines starting with "- " → list items (grouped)
 * - blank line → paragraph break
 */
export function HelpArticleBody({ article }: { article: HelpArticle }) {
  const blocks = article.body.split(/\n\n+/)

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith('# ')) {
          return (
            <h3 key={i} className="mt-6 mb-2 text-base font-semibold text-foreground">
              {block.slice(2)}
            </h3>
          )
        }
        if (block.startsWith('> ')) {
          return (
            <blockquote
              key={i}
              className="my-4 border-l-4 border-[#D97757]/40 pl-4 italic text-muted-foreground"
            >
              {block.slice(2)}
            </blockquote>
          )
        }
        // Bullet list block (lines starting with "- ")
        const lines = block.split('\n')
        if (lines.every((l) => l.startsWith('- ') || l.trim() === '')) {
          return (
            <ul key={i} className="my-3 space-y-1 list-disc list-inside text-muted-foreground">
              {lines
                .filter((l) => l.startsWith('- '))
                .map((l, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(l.slice(2)) }} />
                ))}
            </ul>
          )
        }
        // Numbered list block (lines starting with "1. " etc.)
        if (lines.every((l) => /^\d+\.\s/.test(l) || l.trim() === '')) {
          return (
            <ol key={i} className="my-3 space-y-1 list-decimal list-inside text-muted-foreground">
              {lines
                .filter((l) => /^\d+\.\s/.test(l))
                .map((l, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(l.replace(/^\d+\.\s/, '')) }} />
                ))}
            </ol>
          )
        }
        return (
          <p
            key={i}
            className="my-3 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: renderInline(block) }}
          />
        )
      })}
    </div>
  )
}

function renderInline(text: string): string {
  // Bold **text**
  let out = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
  // Italic *text*
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Inline links [text](url)
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#D97757] hover:underline">$1</a>'
  )
  // Escape newlines → <br> within a paragraph
  out = out.replace(/\n/g, '<br />')
  return out
}

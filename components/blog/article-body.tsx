import { Callout } from '@/components/ui'
import { Section } from '@/components/common'
import type { BlogContentBlock } from '@/lib/data/blog/articles'
import { ArticleTable } from './article-table'

export function ArticleBody({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <Section>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={index}>{block.text}</h2>
          case 'paragraph':
            return <p key={index}>{block.content}</p>
          case 'list': {
            const ListTag = block.ordered ? 'ol' : 'ul'
            return (
              <ListTag
                key={index}
                className={
                  block.ordered
                    ? 'list-decimal space-y-4 pl-6'
                    : 'list-disc space-y-4 pl-6'
                }
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ListTag>
            )
          }
          case 'callout':
            return (
              <Callout key={index} tone={block.tone}>
                {block.content}
              </Callout>
            )
          case 'table':
            return (
              <ArticleTable key={index} head={block.head} rows={block.rows} />
            )
          default:
            return null
        }
      })}
    </Section>
  )
}

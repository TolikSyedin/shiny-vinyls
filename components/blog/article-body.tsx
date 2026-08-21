import { Callout } from '@/components/ui'
import type { BlogContentBlock } from '@/lib/data/blog/articles'
import { ArticleTable } from './article-table'

export function ArticleBody({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <div className="mt-[2.25rem] flex max-w-[68ch] flex-col gap-[1.05rem]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={index} className="mt-[1.25rem]">
                {block.text}
              </h2>
            )
          case 'paragraph':
            return (
              <p key={index} className="text-[1.02rem] leading-[1.68]">
                {block.content}
              </p>
            )
          case 'list': {
            const ListTag = block.ordered ? 'ol' : 'ul'
            return (
              <ListTag
                key={index}
                className={
                  block.ordered
                    ? 'list-decimal space-y-[0.55rem] pl-[1.4rem]'
                    : 'list-disc space-y-[0.55rem] pl-[1.4rem]'
                }
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-[1.6]">
                    {item}
                  </li>
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
            return <ArticleTable key={index} head={block.head} rows={block.rows} />
          default:
            return null
        }
      })}
    </div>
  )
}

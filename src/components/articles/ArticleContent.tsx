
import React from 'react';
import Markdown from 'react-markdown';
import ArticleMarkdownImage from '@/components/articles/ArticleMarkdownImage';

interface ArticleContentProps {
  content: string;
  excerpt: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, excerpt }) => {
  return (
    <div className="prose prose-lg max-w-none">
      {content ? (
        <Markdown
          components={{
            img: ({ src, alt, title }) => (
              <ArticleMarkdownImage src={src} alt={alt} title={title} />
            ),
          }}
        >
          {content}
        </Markdown>
      ) : (
        <p className="text-muted-foreground mb-4">{excerpt}</p>
      )}
    </div>
  );
};

export default ArticleContent;

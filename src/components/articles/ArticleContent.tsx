
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ArticleMarkdownImage from '@/components/articles/ArticleMarkdownImage';

interface ArticleContentProps {
  content: string;
  excerpt: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, excerpt }) => {
  return (
    <div className="prose prose-lg max-w-none prose-table:my-6 prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-th:border prose-td:border prose-th:border-border prose-td:border-border">
      {content ? (
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt, title }) => (
              <ArticleMarkdownImage src={src} alt={alt} title={title} />
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse">{children}</table>
              </div>
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

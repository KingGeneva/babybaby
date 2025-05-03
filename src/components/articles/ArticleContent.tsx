
import React from 'react';
import Markdown from 'react-markdown';

interface ArticleContentProps {
  content: string;
  excerpt: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, excerpt }) => {
  return (
    <div className="prose prose-lg max-w-none">
      {content ? (
        <Markdown>
          {content}
        </Markdown>
      ) : (
        <p className="text-gray-700 mb-4">
          {excerpt}
        </p>
      )}
    </div>
  );
};

export default ArticleContent;

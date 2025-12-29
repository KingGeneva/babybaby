import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleMarkdownImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

/**
 * Image renderer for react-markdown that reserves space to prevent layout shift.
 * We assume a 16:9 ratio by default for editorial images.
 */
const ArticleMarkdownImage: React.FC<ArticleMarkdownImageProps> = ({
  src,
  alt,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!src) return null;

  return (
    <figure className="my-6">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-muted"
        style={{ aspectRatio: "16/9", minHeight: "clamp(200px, 35vw, 420px)" }}
      >
        {isLoading && <Skeleton className="absolute inset-0" />}
        <img
          src={src}
          alt={alt || "Illustration de l'article"}
          title={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.25s ease-in-out",
          }}
        />
      </div>
      {alt ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">{alt}</figcaption>
      ) : null}
    </figure>
  );
};

export default ArticleMarkdownImage;

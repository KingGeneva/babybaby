import React, { useEffect, useMemo, useState } from 'react';

interface ArticleTOCProps {
  content: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

/**
 * Extracts H2 + H3 headings from markdown content and renders a
 * sticky table of contents (desktop only). Highlights the active section
 * while the user scrolls.
 */
const ArticleTOC: React.FC<ArticleTOCProps> = ({ content }) => {
  const headings = useMemo<Heading[]>(() => {
    if (!content) return [];
    const lines = content.split('\n');
    const result: Heading[] = [];
    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`]/g, '').trim();
        result.push({ id: slugify(text), text, level });
      }
    }
    return result;
  }, [content]);

  const [activeId, setActiveId] = useState<string>('');

  // Inject ids onto rendered H2/H3 in the article so anchors work
  useEffect(() => {
    if (headings.length === 0) return;
    const article = document.querySelector('.prose');
    if (!article) return;
    const domHeadings = article.querySelectorAll('h2, h3');
    domHeadings.forEach((el) => {
      const text = el.textContent?.trim() || '';
      const id = slugify(text);
      if (id && !el.id) el.id = id;
    });
  }, [headings, content]);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    const timer = setTimeout(() => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <aside
      aria-label="Sommaire de l'article"
      className="hidden xl:block fixed top-32 left-[max(1rem,calc(50%-32rem-18rem))] w-64 max-h-[calc(100vh-10rem)] overflow-y-auto"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Sommaire
      </p>
      <ul className="space-y-2 text-sm border-l border-border">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li
              key={h.id}
              style={{ paddingLeft: h.level === 3 ? '1.5rem' : '1rem' }}
              className="relative"
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(h.id);
                  if (el) {
                    window.scrollTo({
                      top: el.getBoundingClientRect().top + window.scrollY - 96,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`block py-1 transition-colors leading-snug ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <span className="absolute -left-px top-0 bottom-0 w-0.5 bg-primary" />
                )}
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ArticleTOC;

# Architecture rules

- Public article lists and details share the React Query catalog; preserve partial results and flag incomplete catalogs so failed downloads never become false not-found responses.
- Sort articles by their publication date, then Storage file update time, then numeric id; ids alone do not represent chronological publication order.
- Keep generated Vite cache files out of application changes; they are disposable local tooling output, not source.
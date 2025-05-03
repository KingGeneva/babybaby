
export interface Ebook {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  series?: {
    id: string;
    name: string;
    order: number;
  };
}

export interface EbookSeries {
  id: string;
  name: string;
  ebooks: Ebook[];
}

export type EbookFilterOptions = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

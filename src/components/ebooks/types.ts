
export interface Ebook {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  coverImage: string;
  fileType: string;
  fileSize: string;
  tags: string[];
  uploadDate?: string;  // Making uploadDate optional
  author?: string;      // Making author optional
  publishDate?: string; // Making publishDate optional
}

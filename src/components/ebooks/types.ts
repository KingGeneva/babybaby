
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
}

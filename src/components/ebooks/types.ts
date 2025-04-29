
export interface Ebook {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  downloadUrl?: string; // Adding this for backward compatibility
}

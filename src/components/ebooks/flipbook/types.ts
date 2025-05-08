
export interface FlipbookViewerProps {
  pdfUrl: string;
  title: string;
}

declare global {
  interface Window {
    FlowPaperViewer?: any;
    $?: any;
  }
}

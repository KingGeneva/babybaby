
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ImageItem {
  url: string;
  caption: string;
  title?: string;
  alt?: string;
}

interface ImageGalleryStructuredDataProps {
  headline: string;
  description: string;
  images: ImageItem[];
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogo?: string;
  pageUrl: string;
}

const ImageGalleryStructuredData: React.FC<ImageGalleryStructuredDataProps> = ({
  headline,
  description,
  images,
  datePublished,
  dateModified = datePublished,
  authorName = "BabyBaby",
  publisherName = "BabyBaby",
  publisherLogo = "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
  pageUrl,
}) => {
  // ImageGallery structured data pour les pages contenant des collections d'images
  const imageGalleryStructuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "headline": headline,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Organization",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo,
        "width": "192",
        "height": "192"
      }
    },
    "contentUrl": pageUrl,
    "associatedMedia": images.map(img => ({
      "@type": "ImageObject",
      "contentUrl": img.url,
      "caption": img.caption,
      "name": img.title || img.caption
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(imageGalleryStructuredData)}
      </script>
    </Helmet>
  );
};

export default ImageGalleryStructuredData;

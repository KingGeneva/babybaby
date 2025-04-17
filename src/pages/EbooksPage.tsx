
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { ebooksData } from '@/components/ebooks/ebooksData';
import EbookGrid from '@/components/ebooks/EbookGrid';
import EbookFilters from '@/components/ebooks/EbookFilters';
import { Ebook } from '@/components/ebooks/types';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const EbooksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);

  const filteredEbooks = useMemo(() => {
    return ebooksData.filter(ebook => {
      const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedFileType || ebook.fileType === selectedFileType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedFileType]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-babybaby-cosmic">
            Bibliothèque d'E-books
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Search bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un e-book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            <EbookFilters
              selectedFileType={selectedFileType}
              onFileTypeChange={setSelectedFileType}
            />
          </div>

          <EbookGrid ebooks={filteredEbooks} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EbooksPage;

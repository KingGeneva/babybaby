
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MilestoneFiltersProps {
  categories: string[];
  activeTab: string;
}

const MilestoneFilters: React.FC<MilestoneFiltersProps> = ({ categories, activeTab }) => {
  return (
    <TabsList className="mb-4 flex flex-wrap">
      <TabsTrigger value="all">Tous</TabsTrigger>
      <TabsTrigger value="completed">Complétés</TabsTrigger>
      <TabsTrigger value="upcoming">À venir</TabsTrigger>
      {categories.map(category => (
        <TabsTrigger key={category} value={category}>
          {category}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default MilestoneFilters;

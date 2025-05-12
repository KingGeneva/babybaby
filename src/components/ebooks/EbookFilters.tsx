
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EbookFiltersProps {
  selectedFileType: string | null;
  onFileTypeChange: (value: string | null) => void;
}

const EbookFilters: React.FC<EbookFiltersProps> = ({
  selectedFileType,
  onFileTypeChange
}) => {
  return (
    <div className="flex gap-4">
      <Select
        value={selectedFileType || "all"}
        onValueChange={(value) => onFileTypeChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type de fichier" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="EPUB">EPUB</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EbookFilters;


import React, { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Image, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ForumEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// Éditeur de texte simplifié avec support HTML basique
const ForumEditor: React.FC<ForumEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Écrivez votre message...",
  minHeight = "150px"
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  // Insérer du texte formaté à la position du curseur
  const insertFormatting = (startTag: string, endTag: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + startTag + selectedText + endTag + value.substring(end);
    
    onChange(newText);
    
    // Remettre le focus et positionner le curseur après l'insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  // Fonctions pour les différents formatages
  const handleBold = () => insertFormatting('<strong>', '</strong>');
  const handleItalic = () => insertFormatting('<em>', '</em>');
  const handleUnorderedList = () => insertFormatting('<ul>\n  <li>', '</li>\n</ul>');
  const handleOrderedList = () => insertFormatting('<ol>\n  <li>', '</li>\n</ol>');
  const handleAlignLeft = () => insertFormatting('<div style="text-align: left;">', '</div>');
  const handleAlignCenter = () => insertFormatting('<div style="text-align: center;">', '</div>');
  const handleAlignRight = () => insertFormatting('<div style="text-align: right;">', '</div>');

  // Insérer un lien
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
    insertFormatting(linkHtml, '');
    
    setLinkUrl('');
    setLinkText('');
  };

  // Insérer une image
  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    
    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%;" />`;
    insertFormatting(imageHtml, '');
    
    setImageUrl('');
    setImageAlt('');
  };

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap p-2 gap-1 border-b bg-gray-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleBold} type="button">
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Gras</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleItalic} type="button">
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italique</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleUnorderedList} type="button">
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Liste à puces</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleOrderedList} type="button">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Liste numérotée</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleAlignLeft} type="button">
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Aligner à gauche</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleAlignCenter} type="button">
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Centrer</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleAlignRight} type="button">
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Aligner à droite</p>
            </TooltipContent>
          </Tooltip>
        
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" type="button">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insérer un lien</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Insérer un lien</h4>
                  <p className="text-sm text-muted-foreground">
                    Saisissez l'URL et éventuellement un texte pour le lien
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://exemple.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link-text">Texte du lien (optionnel)</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Texte à afficher"
                  />
                </div>
                <Button type="button" onClick={handleInsertLink}>Insérer</Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" type="button">
                      <Image className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insérer une image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Insérer une image</h4>
                  <p className="text-sm text-muted-foreground">
                    Saisissez l'URL de l'image et une description optionnelle
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image-url">URL de l'image</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image-alt">Description (optionnel)</Label>
                  <Input
                    id="image-alt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Description de l'image"
                  />
                </div>
                <Button type="button" onClick={handleInsertImage}>Insérer</Button>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-none rounded-none rounded-b-md focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{ minHeight }}
      />
    </div>
  );
};

export default ForumEditor;

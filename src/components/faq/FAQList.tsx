
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { FAQ } from './faqData';

interface FAQListProps {
  filteredFAQs: FAQ[];
}

const FAQList: React.FC<FAQListProps> = ({ filteredFAQs }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {filteredFAQs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="px-6 py-4 hover:bg-sky-50/50 text-left">
                <span className="text-lg font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucune question ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
};

export default FAQList;

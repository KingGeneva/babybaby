import { findBestResponse, getSuggestedQuestions } from './knowledgeBase';

// Bot responses based on enriched knowledge base
export const getBotResponse = (userMessage: string): string => {
  // Utilise la base de connaissances enrichie
  const response = findBestResponse(userMessage);
  
  if (response) {
    return response;
  }
  
  // Réponse par défaut avec suggestions
  const suggestions = getSuggestedQuestions();
  return `Je ne suis pas sûr de comprendre votre question. Voici quelques sujets sur lesquels je peux vous aider :\n\n• ${suggestions.join('\n• ')}\n\nN'hésitez pas à me poser une question sur le sommeil, l'alimentation, le développement, la santé de bébé, ou les fonctionnalités de l'application BabyBaby !`;
};

// Export pour les suggestions de questions rapides
export { getSuggestedQuestions };

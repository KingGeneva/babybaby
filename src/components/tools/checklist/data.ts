
export const categories = [
  'Chambre', 'Vêtements', 'Hygiène', 'Alimentation', 'Déplacements', 'Administratif', 'Autre'
];

export const defaultItems = [
  // Chambre
  { id: '1', text: 'Lit bébé', checked: false, category: 'Chambre' },
  { id: '2', text: 'Matelas pour lit bébé', checked: false, category: 'Chambre' },
  { id: '3', text: 'Alèse imperméable', checked: false, category: 'Chambre' },
  { id: '4', text: 'Draps-housses (2-3)', checked: false, category: 'Chambre' },
  { id: '5', text: 'Tour de lit', checked: false, category: 'Chambre' },
  { id: '6', text: 'Gigoteuses (2-3)', checked: false, category: 'Chambre' },
  { id: '7', text: 'Commode à langer', checked: false, category: 'Chambre' },
  { id: '8', text: 'Veilleuse', checked: false, category: 'Chambre' },
  { id: '9', text: 'Babyphone', checked: false, category: 'Chambre' },
  
  // Vêtements
  { id: '10', text: 'Bodies manches courtes (6-8)', checked: false, category: 'Vêtements' },
  { id: '11', text: 'Bodies manches longues (6-8)', checked: false, category: 'Vêtements' },
  { id: '12', text: 'Pyjamas (4-6)', checked: false, category: 'Vêtements' },
  { id: '13', text: 'Brassières (2-3)', checked: false, category: 'Vêtements' },
  { id: '14', text: 'Chaussettes (4-6 paires)', checked: false, category: 'Vêtements' },
  { id: '15', text: 'Bonnets (2)', checked: false, category: 'Vêtements' },
  { id: '16', text: 'Bavoirs (6-8)', checked: false, category: 'Vêtements' },
  
  // Hygiène
  { id: '17', text: 'Baignoire bébé', checked: false, category: 'Hygiène' },
  { id: '18', text: 'Transat de bain', checked: false, category: 'Hygiène' },
  { id: '19', text: 'Thermomètre pour bain', checked: false, category: 'Hygiène' },
  { id: '20', text: 'Serviettes de bain à capuche (2-3)', checked: false, category: 'Hygiène' },
  { id: '21', text: 'Couches nouveau-né', checked: false, category: 'Hygiène' },
  { id: '22', text: 'Lingettes ou coton', checked: false, category: 'Hygiène' },
  { id: '23', text: 'Liniment ou produit nettoyant', checked: false, category: 'Hygiène' },
  { id: '24', text: 'Crème pour le change', checked: false, category: 'Hygiène' },
  { id: '25', text: 'Thermomètre médical', checked: false, category: 'Hygiène' },
  { id: '26', text: 'Ciseaux à ongles pour bébé', checked: false, category: 'Hygiène' },
  
  // Alimentation
  { id: '27', text: 'Biberons (4-6)', checked: false, category: 'Alimentation' },
  { id: '28', text: 'Tétines de rechange', checked: false, category: 'Alimentation' },
  { id: '29', text: 'Goupillon pour biberons', checked: false, category: 'Alimentation' },
  { id: '30', text: 'Chauffe-biberon', checked: false, category: 'Alimentation' },
  { id: '31', text: 'Stérilisateur', checked: false, category: 'Alimentation' },
  { id: '32', text: 'Lait infantile', checked: false, category: 'Alimentation' },
  { id: '33', text: 'Coussin d\'allaitement', checked: false, category: 'Alimentation' },
  
  // Déplacements
  { id: '34', text: 'Poussette', checked: false, category: 'Déplacements' },
  { id: '35', text: 'Siège auto', checked: false, category: 'Déplacements' },
  { id: '36', text: 'Porte-bébé ou écharpe de portage', checked: false, category: 'Déplacements' },
  { id: '37', text: 'Sac à langer', checked: false, category: 'Déplacements' },
  { id: '38', text: 'Couverture de voyage', checked: false, category: 'Déplacements' },
  
  // Administratif
  { id: '39', text: 'Déclarer la naissance (3 jours)', checked: false, category: 'Administratif' },
  { id: '40', text: 'Inscrire bébé à la sécurité sociale', checked: false, category: 'Administratif' },
  { id: '41', text: 'Demander la prime de naissance', checked: false, category: 'Administratif' },
  { id: '42', text: 'Demander les allocations familiales', checked: false, category: 'Administratif' },
  { id: '43', text: 'Trouver un pédiatre', checked: false, category: 'Administratif' },
  { id: '44', text: 'Déclarer bébé aux impôts', checked: false, category: 'Administratif' },
] as const;

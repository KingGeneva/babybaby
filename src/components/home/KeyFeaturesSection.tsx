import React from 'react';
import { Activity, BellRing, Blocks, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Activity, title: 'Suivi de croissance OMS', text: 'Enregistrez et visualisez la croissance de votre enfant avec des courbes comparées aux normes OMS.', to: '/tools', label: 'Découvrir les outils' },
  { icon: BellRing, title: 'Calendrier vaccinal numérique', text: 'Gérez les rendez-vous et suivez le calendrier de vaccination selon les recommandations officielles.', to: '/tools', label: 'Voir le calendrier' },
  { icon: Blocks, title: 'Jalons de développement', text: 'Repérez les étapes clés de la motricité, du langage et du développement social, de 0 à 36 mois.', to: '/articles', label: 'Lire les guides' },
];

const KeyFeaturesSection: React.FC = () => {
  return (
    <section 
      className="editorial-section tools-showcase"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-5 md:px-8">
        <header className="editorial-heading" data-reveal>
          <p className="section-kicker">Des repères, jamais du bruit</p>
          <h2 
            id="features-heading" 
            className="section-title"
          >
            Des outils pensés pour le quotidien.
          </h2>
          <p className="section-intro">
            Retrouvez au même endroit les repères utiles pour suivre le développement de votre enfant, préparer vos rendez-vous et avancer sereinement.
          </p>
        </header>
        <div className="feature-editorial-grid" role="list">
          {features.map(({ icon: Icon, title, text, to, label }, index) => (
            <article key={title} className={`feature-editorial-item feature-editorial-item-${index + 1}`} role="listitem" data-reveal>
              <span className="feature-index">0{index + 1}</span>
              <div className="feature-icon"><Icon aria-hidden /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link to={to} className="feature-link">{label}<ArrowUpRight aria-hidden /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;

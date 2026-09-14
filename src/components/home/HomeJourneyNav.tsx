import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const stages = [
  { step: "01", label: "Grossesse", detail: "Préparer l’arrivée", to: "/articles" },
  { step: "02", label: "Naissance", detail: "Comprendre les premiers jours", to: "/ebooks" },
  { step: "03", label: "Premiers mois", detail: "Suivre son développement", to: "/tools" },
];

const HomeJourneyNav = () => (
  <nav aria-label="Ressources par étape" className="home-journey" data-reveal>
    <div className="container mx-auto px-5 md:px-8">
      <p className="section-kicker">Un chemin à votre rythme</p>
      <div className="home-journey-grid">
        {stages.map((stage) => (
          <Link key={stage.step} to={stage.to} className="home-journey-link group">
            <span className="home-journey-number">{stage.step}</span>
            <span>
              <strong>{stage.label}</strong>
              <small>{stage.detail}</small>
            </span>
            <ArrowRight aria-hidden className="ml-auto transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  </nav>
);

export default HomeJourneyNav;
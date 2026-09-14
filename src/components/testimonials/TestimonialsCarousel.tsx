
import React from 'react';
import { BookOpen, Calculator, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

const pathways = [
  { icon: BookOpen, title: "Comprendre", text: "Des guides clairs pour mettre les grandes étapes en contexte.", to: "/articles" },
  { icon: Calculator, title: "Prévoir", text: "Des calculateurs pratiques pour préparer le quotidien.", to: "/calculateur-cout-bebe-quebec" },
  { icon: HeartHandshake, title: "Avancer", text: "Des ressources à conserver et à partager avec votre entourage.", to: "/ebooks" },
];

const TestimonialsCarousel = () => {
  return (
    <section className="pathway-band" aria-labelledby="pathway-heading">
      <div className="container mx-auto px-5 md:px-8">
        <h2 id="pathway-heading" className="sr-only">Trois façons d’utiliser BabyBaby</h2>
        <div className="pathway-grid" data-draw-line>
          {pathways.map(({ icon: Icon, title, text, to }) => (
            <Link to={to} key={title} className="pathway-item" data-reveal>
              <Icon aria-hidden />
              <h3>{title}</h3>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;

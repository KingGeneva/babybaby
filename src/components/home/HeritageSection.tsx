import React from 'react';
import { Calendar, Award, Globe } from 'lucide-react';

const HeritageSection: React.FC = () => {
  return (
    <section
      className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      aria-labelledby="heritage-heading"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Depuis 1998
          </span>
          <h2
            id="heritage-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Un héritage de plus de 25 ans au service des familles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            BabyBaby.org est l'un des plus anciens domaines dédiés à la parentalité
            sur le web — actif depuis 1998.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <Calendar className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">1998 — Création</h3>
            <p className="text-sm text-muted-foreground">
              Lancement du domaine babybaby.org, l'une des premières adresses
              web consacrées à l'univers du bébé.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <Award className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">2000–2003 — Martha Stewart</h3>
            <p className="text-sm text-muted-foreground">
              Le domaine a été détenu et exploité par Martha Stewart Living
              Omnimedia, hébergeant la section « Baby » de marthastewart.com.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <Globe className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">2023 — Refondation</h3>
            <p className="text-sm text-muted-foreground">
              Refondé en application moderne pour les parents francophones :
              suivi de croissance, conseils d'experts et communauté.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground italic">
          Historique vérifiable sur{' '}
          <a
            href="https://web.archive.org/web/2000*/babybaby.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Internet Archive (Wayback Machine)
          </a>
        </p>
      </div>
    </section>
  );
};

export default HeritageSection;

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
            Histoire du domaine
          </span>
          <h2
            id="heritage-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Un nom de domaine avec une longue histoire
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Le domaine babybaby.org est enregistré depuis 1998 et a servi à
            d'autres projets avant nous. La plateforme actuelle, elle, est un
            projet récent et distinct.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <Calendar className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">1998 — Enregistrement du domaine</h3>
            <p className="text-sm text-muted-foreground">
              Le nom de domaine babybaby.org est enregistré. Ce projet n'a
              aucun lien avec la plateforme actuelle.
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
            <h3 className="font-semibold mb-2">Aujourd'hui — Plateforme actuelle</h3>
            <p className="text-sm text-muted-foreground">
              Le domaine est repris pour la plateforme BabyBaby actuelle,
              destinée aux parents du Québec : guides, comparatifs et outils.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground italic">
          Historique du domaine vérifiable sur{' '}
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

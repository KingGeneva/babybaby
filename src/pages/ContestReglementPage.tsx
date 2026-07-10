import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ReglementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Règlement officiel du concours"
        description="Règlement officiel du concours BabyBaby : conditions d'admissibilité, mécanique de participation, tirage et remise du prix."
        canonicalUrl="https://babybaby.org/contests/reglement"
        noIndex
      />
      <NavBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/contests" className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Retour au concours
          </Link>
          <article className="prose prose-neutral max-w-none">
            <h1>Règlement officiel du concours</h1>
            <p className="text-sm text-muted-foreground">
              Concours « Panier de naissance québécois » — organisé par BabyBaby (babybaby.org).
            </p>

            <h2>1. Admissibilité</h2>
            <p>
              Le concours est ouvert aux résidents de la province de Québec (Canada) âgés de 18 ans et plus au moment
              de l'inscription. Les employés, représentants et membres de leur famille immédiate de BabyBaby sont exclus.
            </p>

            <h2>2. Durée</h2>
            <p>
              Le concours se déroule sur une période de 30 jours à compter de sa mise en ligne. La date de fin est
              affichée sur la page du concours. Aucune participation reçue après cette date ne sera admissible.
            </p>

            <h2>3. Mécanique de participation</h2>
            <ul>
              <li>Inscription gratuite via le formulaire courriel sur la page du concours.</li>
              <li>Une (1) inscription par personne = une (1) entrée au tirage.</li>
              <li>Chaque personne inscrite reçoit un lien de parrainage unique.</li>
              <li>
                Pour chaque nouvelle personne inscrite via ce lien, le parrain ou la marraine reçoit trois (3) entrées
                supplémentaires au tirage.
              </li>
            </ul>

            <h2>4. Prix</h2>
            <p>
              Un (1) panier de naissance québécois d'une valeur approximative de 250 $ CAD, composé de produits
              d'entreprises locales. Le prix n'est ni monnayable, ni échangeable, ni transférable.
            </p>

            <h2>5. Tirage et attribution</h2>
            <p>
              Le tirage sera effectué au hasard parmi l'ensemble des entrées admissibles dans les 7 jours suivant la
              date de fin. La personne gagnante sera contactée par courriel et disposera de 10 jours ouvrables pour
              réclamer son prix, faute de quoi un nouveau tirage sera effectué.
            </p>

            <h2>6. Données personnelles</h2>
            <p>
              Les adresses courriel recueillies servent exclusivement à l'administration du concours et à
              l'infolettre BabyBaby (désinscription possible en tout temps). Elles ne sont ni vendues ni partagées.
            </p>

            <h2>7. Autorité et différends</h2>
            <p>
              Un différend quant à l'organisation ou à la conduite d'un concours publicitaire peut être soumis à la
              Régie des alcools, des courses et des jeux afin qu'il soit tranché. Un différend quant à l'attribution
              d'un prix peut être soumis à la Régie uniquement aux fins d'une intervention pour tenter de le régler.
            </p>
            <p className="text-sm text-muted-foreground">
              [À COMPLÉTER : numéro de licence Régie si requis selon la valeur du prix.]
            </p>

            <h2>8. Modifications</h2>
            <p>
              BabyBaby se réserve le droit d'annuler, de suspendre ou de modifier le présent concours en tout temps,
              sous réserve de l'approbation de la Régie si applicable.
            </p>

            <p className="text-xs text-muted-foreground mt-8">
              Pour toute question : <a href="mailto:contact@babybaby.org">contact@babybaby.org</a>
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReglementPage;

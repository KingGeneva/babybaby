import React from "react";
import { Info } from "lucide-react";

interface AffiliateDisclosureProps {
  className?: string;
}

const AffiliateDisclosure: React.FC<AffiliateDisclosureProps> = ({ className }) => {
  return (
    <aside
      role="note"
      aria-label="Divulgation d'affiliation"
      className={
        "flex gap-3 items-start rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground " +
        (className ?? "")
      }
    >
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" aria-hidden />
      <p className="leading-relaxed">
        <strong className="text-foreground">Divulgation d'affiliation :</strong>{" "}
        BabyBaby participe au Programme Partenaires d'Amazon. Certains liens de cette page
        sont des liens affiliés : si vous achetez via ces liens, nous touchons une petite
        commission, <em>sans aucun surcoût pour vous</em>. Nos recommandations restent
        indépendantes et basées sur la recherche.
      </p>
    </aside>
  );
};

export default AffiliateDisclosure;

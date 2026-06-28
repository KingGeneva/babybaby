import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { productCategories, type Product } from "@/data/babyProductsReport";
import { getProductDestination } from "@/lib/affiliate";

function findProduct(productId: string): Product | undefined {
  for (const cat of productCategories) {
    const found = cat.products.find((p) => p.id === productId);
    if (found) return found;
  }
  return undefined;
}

const AffiliateRedirectPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Produit introuvable.");
      return;
    }
    const product = findProduct(productId);
    if (!product) {
      setError("Produit introuvable.");
      return;
    }

    const url = getProductDestination(product);
    setDestination(url);

    let redirected = false;
    const go = () => {
      if (redirected) return;
      redirected = true;
      window.location.replace(url);
    };

    // Fire-and-forget logging — never block the redirect.
    const logPromise = Promise.resolve(
      supabase.from("affiliate_clicks").insert({
        product_id: product.id,
        product_name: `${product.brand} ${product.name}`.trim(),
        destination_url: url,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      }),
    ).then(
      () => undefined,
      () => undefined,
    );

    const timeoutId = window.setTimeout(go, 800);
    logPromise.then(() => {
      window.clearTimeout(timeoutId);
      go();
    });

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [productId]);

  return (
    <>
      <Helmet>
        <title>Redirection en cours…</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div>
          <div
            aria-hidden
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#0a4b8c",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.9s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            {error ? "Lien indisponible" : "Redirection vers le marchand…"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            {error
              ? error
              : "Vous êtes redirigé vers Amazon.ca. BabyBaby touche une petite commission si vous achetez via ce lien."}
          </p>
          {destination && (
            <p style={{ marginTop: 16, fontSize: 13 }}>
              Si la redirection ne s'effectue pas,{" "}
              <a href={destination} rel="sponsored nofollow noopener">
                cliquez ici
              </a>
              .
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default AffiliateRedirectPage;

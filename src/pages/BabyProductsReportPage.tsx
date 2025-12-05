import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import ReportStructuredData from '@/components/report/ReportStructuredData';
import ReportHero from '@/components/report/ReportHero';
import ReportTableOfContents from '@/components/report/ReportTableOfContents';
import ReportCategorySection from '@/components/report/ReportCategorySection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { 
  reportMetadata, 
  productCategories, 
  conclusionContent 
} from '@/data/babyProductsReport';

const BabyProductsReportPage: React.FC = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reportMetadata.shortTitle,
          text: reportMetadata.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <SEOHead
        title="Les meilleurs produits pour bébé à acheter en 2026 | Guide complet"
        description={reportMetadata.description}
        canonicalUrl="https://babybaby.app/meilleurs-produits-bebe-2026"
        ogType="article"
        keywords={reportMetadata.keywords}
        articleData={{
          publishedTime: reportMetadata.publishDate,
          modifiedTime: reportMetadata.updateDate,
          author: reportMetadata.author,
          section: "Guides",
          tags: reportMetadata.keywords
        }}
      />
      <ReportStructuredData />

      <div className="min-h-screen bg-background">
        <NavBar />

        {/* Hero Section */}
        <ReportHero />

        {/* Action Buttons */}
        <div className="container mx-auto px-4 -mt-6 mb-8 relative z-10">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/reports/Comparatif_Produits_Bebe_2026.pdf" download>
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </a>
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Table of Contents (Desktop) */}
            <aside className="hidden lg:block">
              <ReportTableOfContents categories={productCategories} />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile TOC */}
              <div className="lg:hidden mb-8">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer bg-muted/50 rounded-lg p-4">
                    <span className="font-semibold">Table des matières</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                    <nav>
                      <ol className="space-y-2">
                        {productCategories.map((category, index) => (
                          <li key={category.id}>
                            <a
                              href={`#${category.slug}`}
                              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                            >
                              <Badge variant="outline" className="w-6 h-6 flex items-center justify-center text-xs">
                                {index + 1}
                              </Badge>
                              {category.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </div>
                </details>
              </div>

              {/* Category Sections */}
              {productCategories.map((category, index) => (
                <ReportCategorySection 
                  key={category.id} 
                  category={category} 
                  index={index} 
                />
              ))}

              {/* Conclusion */}
              <section id="conclusion" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="pt-8 pb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl md:text-3xl font-bold">{conclusionContent.title}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {conclusionContent.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </section>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <Card className="bg-card border-2 border-primary/20">
                  <CardContent className="pt-8 pb-8 text-center">
                    <h3 className="text-xl font-bold mb-2">
                      Vous avez trouvé ce guide utile?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Partagez-le avec d'autres parents et consultez nos autres ressources.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager le guide
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="/articles">
                          Voir nos articles
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BabyProductsReportPage;

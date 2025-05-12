
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { courses } from '@/data/courses';
import ArticleStructuredData from '@/components/articles/ArticleStructuredData';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';

const CoursesSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Afficher seulement les 3 premiers cours
  const featuredCourses = courses.slice(0, 3);
  
  // Rich structured data for SEO
  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": featuredCourses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": "BabyBaby",
          "sameAs": "https://babybaby.app"
        },
        "url": `https://babybaby.app/courses/${course.id}`,
        "image": course.image
      }
    }))
  };

  const handleCourseAccess = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour accéder à tous nos cours.",
        variant: "default",
      });
    }
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <ArticleStructuredData
          title="Cours pour parents - BabyBaby"
          description="Développez vos connaissances parentales avec nos cours spécialement conçus"
          image="https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png"
          datePublished="2025-05-01"
          authorName="BabyBaby"
          url="https://babybaby.app/courses"
          category="Formation"
        />

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <GraduationCap className="mx-auto h-12 w-12 text-babybaby-cosmic mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">
            Développez vos connaissances parentales
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos cours et formations pour vous accompagner tout au long de votre parcours parental
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-xs">
                      {course.level}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center text-sm gap-1 text-gray-500 mb-3">
                    <BookOpen size={14} className="text-babybaby-cosmic" />
                    <span>{course.duration}</span>
                    <span className="mx-1">•</span>
                    <span>{course.modules.length} modules</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {course.description}
                  </p>
                  
                  {user ? (
                    <Link to={`/courses/${course.id}`} className="block w-full">
                      <Button variant="outline" className="w-full">
                        Voir le cours
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth" className="block w-full" onClick={handleCourseAccess}>
                      <Button variant="outline" className="w-full">
                        Connectez-vous pour accéder
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/courses">
            <Button variant="default" size="lg" className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
              Voir tous les cours
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Structured Data for SEO */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(courseStructuredData)}
          </script>
        </Helmet>
      </div>
    </section>
  );
};

export default CoursesSection;

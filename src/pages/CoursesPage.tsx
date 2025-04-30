
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen, Clock, User, Search, BookText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/common/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { courses } from "@/data/courses";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  
  // Dans une version future, on pourrait charger les cours depuis Supabase
  const { data: allCourses = courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => courses,
  });
  
  // Extraire toutes les catégories uniques
  const categories = ["all", ...Array.from(new Set(allCourses.map(course => course.category)))];
  
  // Filtrer les cours en fonction de la recherche et de la catégorie
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <SEOHead
          title="Cours pour parents - BabyBaby"
          description="Apprenez à prendre soin de votre bébé avec nos cours en ligne spécialement conçus pour les nouveaux parents."
        />
        
        <NavBar />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2 text-center text-babybaby-cosmic">
              Cours pour parents
            </h1>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Développez vos compétences parentales avec nos cours en ligne conçus par des experts. 
              Des leçons interactives pour vous accompagner à chaque étape du développement de votre enfant.
            </p>
            
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher un cours..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                className="w-full md:w-auto"
              >
                <TabsList className="w-full overflow-x-auto">
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category === "all" ? "Tous" : category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucun cours trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-xs">
            {course.level}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold line-clamp-2">
          {course.title}
        </CardTitle>
        <CardDescription className="flex items-center text-sm gap-1 text-muted-foreground">
          <User size={14} className="text-babybaby-cosmic" />
          <span>{course.instructor}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{course.modules.length} modules</span>
          </div>
        </div>
      </CardContent>
      
      <Separator className="mx-4" />
      
      <CardFooter className="pt-4">
        <Link to={`/courses/${course.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Accéder au cours
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CoursesPage;

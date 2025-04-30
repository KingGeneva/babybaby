
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Calendar, Clock, BookText, ChevronDown, Play, FileText, Link as LinkIcon, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/common/SEOHead";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { CourseModule } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contenu");
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Cours non trouvé</h1>
            <Button onClick={() => navigate("/courses")}>
              Retour aux cours
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title={`${course.title} - BabyBaby`}
          description={course.description}
        />
        
        <NavBar />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/courses">Cours</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>{course.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informations du cours */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{course.level}</Badge>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4 text-babybaby-cosmic">
                    {course.title}
                  </h1>
                  
                  <p className="text-gray-700 mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-1">
                      <User size={18} className="text-babybaby-cosmic" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={18} className="text-babybaby-cosmic" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={18} className="text-babybaby-cosmic" />
                      <span>Mis à jour le {course.updatedAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Play className="mr-2" size={20} />
                      Regarder l'introduction
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4 w-full sm:w-auto">
                    <TabsTrigger value="contenu">Contenu du cours</TabsTrigger>
                    <TabsTrigger value="resources">Ressources</TabsTrigger>
                    <TabsTrigger value="instructor">Instructeur</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="contenu" className="space-y-4">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: course.modules[0].content }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="space-y-4">
                    <h3 className="text-xl font-medium mb-2">Documents et ressources</h3>
                    <div className="space-y-2">
                      {course.modules.flatMap(module => module.resources || []).map(resource => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center gap-2">
                            {resource.type === 'pdf' && <FileText className="text-red-500" size={18} />}
                            {resource.type === 'video' && <Play className="text-blue-500" size={18} />}
                            {resource.type === 'link' && <LinkIcon className="text-green-500" size={18} />}
                            <span>{resource.title}</span>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              Télécharger
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructor" className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">{course.instructor}</h3>
                        <p className="text-sm text-gray-600">Spécialiste en parentalité</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Spécialiste renommé dans le domaine de la puériculture, notre instructeur apporte son expertise et son expérience pratique pour vous guider à travers ce cours complet sur les soins et le développement des nouveau-nés.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Programme du cours */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <BookText size={20} className="text-babybaby-cosmic" />
                      <span>Contenu du cours</span>
                    </h2>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {course.modules.length} modules • {course.duration}
                    </p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {course.modules.map((module, index) => (
                        <ModuleItem 
                          key={module.id} 
                          module={module}
                          index={index}
                          isActive={module.id === activeModule}
                          onClick={() => setActiveModule(module.id === activeModule ? null : module.id)}
                        />
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

interface ModuleItemProps {
  module: CourseModule;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ModuleItem = ({ module, index, isActive, onClick }: ModuleItemProps) => {
  return (
    <AccordionItem value={module.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-start gap-3 text-left">
          <div className="mt-0.5 h-6 w-6 rounded-full bg-babybaby-cosmic/10 text-babybaby-cosmic flex items-center justify-center text-sm">
            {index + 1}
          </div>
          <div>
            <p className="font-medium">{module.title}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Clock size={14} />
              <span>{module.duration}</span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-9 pt-1">
          {module.resources?.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                {resource.type === 'pdf' && <FileText className="text-red-500" size={14} />}
                {resource.type === 'video' && <Play className="text-blue-500" size={14} />}
                {resource.type === 'link' && <LinkIcon className="text-green-500" size={14} />}
                <span className="text-sm">{resource.title}</span>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CourseDetailPage;


import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course } from '@/types/course';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight } from 'lucide-react';

interface CourseThematicSectionProps {
  thematicId: string;
  thematicName: string;
  courses: Course[];
}

const CourseThematicSection: React.FC<CourseThematicSectionProps> = ({ 
  thematicId, 
  thematicName, 
  courses
}) => {
  // Trier les cours par position dans la thématique
  const sortedCourses = [...courses].sort((a, b) => 
    (a.thematic?.position || 0) - (b.thematic?.position || 0)
  );

  return (
    <div className="mb-12 bg-gray-50 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-babybaby-cosmic flex items-center">
          <BookOpen className="mr-2" size={24} />
          {thematicName}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Une série de cours chronologiques adaptés à l'âge de votre enfant
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute left-8 top-0 h-full w-0.5 bg-babybaby-cosmic/20 -z-10" />
        
        <div className="space-y-6">
          {sortedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link 
                to={`/courses/${course.id}`}
                className="flex group hover:bg-white p-4 rounded-lg transition-all duration-300 hover:shadow-md"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-babybaby-cosmic border-2 border-white" />
                </div>
                
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg group-hover:text-babybaby-cosmic transition-colors">
                      {course.title}
                    </h3>
                    <ChevronRight className="text-gray-400 group-hover:text-babybaby-cosmic group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.thematic?.ageRange && (
                      <Badge variant="outline" className="bg-babybaby-cosmic/10">
                        {course.thematic.ageRange}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {course.level}
                    </Badge>
                    <Badge variant="outline">
                      {course.duration}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseThematicSection;

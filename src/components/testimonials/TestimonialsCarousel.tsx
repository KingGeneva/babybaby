
import React from 'react';
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Marie L.",
    rating: 5,
    text: "Cette application a transformé notre expérience parentale. Le suivi de croissance est si intuitif !",
    role: "Maman de Lucas, 8 mois"
  },
  {
    name: "Thomas R.",
    rating: 5,
    text: "Les outils sont vraiment pratiques, particulièrement le registre de cadeaux qui nous a beaucoup aidé.",
    role: "Papa de Léa, 3 mois"
  },
  {
    name: "Sophie M.",
    rating: 5,
    text: "Je recommande vivement ! Les graphiques de croissance sont très utiles pour les rendez-vous médicaux.",
    role: "Maman de Jules, 12 mois"
  },
  {
    name: "Pierre D.",
    rating: 5,
    text: "Une application indispensable pour les jeunes parents. La communauté est très bienveillante.",
    role: "Papa de Emma, 6 mois"
  }
];

const TestimonialsCarousel = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-babybaby-lightblue/20 to-transparent overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Ce que disent nos utilisateurs</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full">
                  <Card className="p-6 h-full">
                    <div className="flex items-center space-x-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-4">
                      "{testimonial.text}"
                    </blockquote>
                    <footer className="mt-auto">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </footer>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;

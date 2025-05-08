
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

interface BubbleType {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
  targetSize: number;
  p5: p5;
  update: () => void;
  display: () => void;
  grow: () => void;
  shrink: () => void;
  isNear: (mouseX: number, mouseY: number) => boolean;
}

class Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
  targetSize: number;
  direction: number;
  p5: p5;

  constructor(p5: p5) {
    this.p5 = p5;
    this.x = p5.random(p5.width);
    this.y = p5.random(p5.height);
    this.size = p5.random(5, 25);
    this.targetSize = this.size;
    this.speed = p5.random(0.3, 1.2);
    
    // Palette de couleurs BabyBaby - Bulles bleues et roses uniquement
    const colors = [
      '#33C3F0', // bleu
      '#0EA5E9', // bleu cosmique
      '#FFDEE2', // rose
      '#D946EF', // rose magenta
    ];
    
    this.color = p5.random(colors);
    this.alpha = p5.random(100, 200);
    this.direction = p5.random(0, p5.TWO_PI);
  }

  update() {
    // Mouvement doux de flottement
    this.x += this.speed * this.p5.cos(this.direction);
    this.y += this.speed * this.p5.sin(this.direction);
    
    // Changement de direction pour mouvement plus organique
    this.direction += this.p5.random(-0.05, 0.05);
    
    // Rebond sur les bords
    if (this.x < 0 || this.x > this.p5.width) {
      this.direction = this.p5.PI - this.direction;
    }
    
    if (this.y < 0 || this.y > this.p5.height) {
      this.direction = -this.direction;
    }
    
    // Animation douce de la taille vers la taille cible
    this.size = this.p5.lerp(this.size, this.targetSize, 0.1);
    
    // Fluctuation légère d'opacité
    this.alpha += this.p5.random(-2, 2);
    this.alpha = this.p5.constrain(this.alpha, 100, 200);
  }

  display() {
    this.p5.noStroke();
    const c = this.p5.color(this.color);
    c.setAlpha(this.alpha);
    this.p5.fill(c);
    this.p5.ellipse(this.x, this.y, this.size);
    
    // Ajout d'un halo lumineux
    const halo = this.p5.color(this.color);
    halo.setAlpha(30);
    this.p5.fill(halo);
    this.p5.ellipse(this.x, this.y, this.size * 1.3);
  }
  
  // Méthode pour agrandir la bulle
  grow() {
    this.targetSize = this.size * 1.5;
  }
  
  // Méthode pour rétrécir la bulle
  shrink() {
    this.targetSize = this.size / 1.5;
  }
  
  // Vérifier si la bulle est proche du curseur
  isNear(mouseX: number, mouseY: number) {
    const distance = this.p5.dist(mouseX, mouseY, this.x, this.y);
    return distance < this.size * 2;
  }
}

interface P5CanvasProps {
  className?: string;
}

const P5Canvas: React.FC<P5CanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);
  
  useEffect(() => {
    // Détruire l'instance p5 précédente si elle existe
    if (sketchRef.current) {
      sketchRef.current.remove();
    }
    
    // Créer une nouvelle instance p5
    const sketch = new p5((p: p5) => {
      const bubbles: BubbleType[] = [];
      const bubbleCount = 30; // Réduit de 40 à 30 bulles pour améliorer les performances
      let mouseIsPressed = false;
      
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(canvasRef.current!);
        
        // Création des bulles
        for (let i = 0; i < bubbleCount; i++) {
          bubbles.push(new Bubble(p));
        }
      };

      p.draw = () => {
        p.clear();
        
        // Mise à jour et affichage des bulles
        for (let i = 0; i < bubbles.length; i++) {
          bubbles[i].update();
          bubbles[i].display();
          
          // Vérifier l'interaction avec la souris
          if (p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height) {
            if (bubbles[i].isNear(p.mouseX, p.mouseY)) {
              if (mouseIsPressed) {
                bubbles[i].grow(); // Grandir si le curseur est proche et le bouton pressé
              } else {
                bubbles[i].shrink(); // Rétrécir si juste survolé
              }
            } else if (bubbles[i].targetSize !== bubbles[i].size) {
              // Retour à la taille normale
              bubbles[i].targetSize = p.random(5, 25);
            }
          }
        }
      };

      // Optimisation de la fonction de redimensionnement
      let resizeTimeout: number;
      p.windowResized = () => {
        // Limiter les appels de redimensionnement avec un debounce
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        }, 250) as unknown as number;
      };
      
      p.mousePressed = () => {
        mouseIsPressed = true;
      };
      
      p.mouseReleased = () => {
        mouseIsPressed = false;
      };
    });
    
    sketchRef.current = sketch;
    
    // Cleanup
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, []);

  return (
    <div ref={canvasRef} className={className} />
  );
};

export default P5Canvas;

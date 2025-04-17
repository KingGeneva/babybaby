
import React from 'react';
import p5Types from 'p5';
// We need to use the default import for react-p5
import Sketch from 'react-p5';

interface ParticleType {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
  direction: number;
  p5: p5Types;
  update: () => void;
  display: () => void;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
  direction: number;
  p5: p5Types;

  constructor(p5: p5Types) {
    this.p5 = p5;
    this.x = p5.random(p5.width);
    this.y = p5.random(p5.height);
    this.size = p5.random(2, 6);
    this.speed = p5.random(0.2, 1);
    
    // Palette de couleurs BabyBaby
    const colors = [
      '#33C3F0', // bleu
      '#0EA5E9', // bleu cosmique
      '#FFDEE2', // rose
      '#D3E4FD', // bleu clair
      '#FFFFFF', // blanc
    ];
    
    this.color = p5.random(colors);
    this.alpha = p5.random(100, 200);
    this.direction = p5.random(0, p5.TWO_PI);
  }

  update() {
    this.x += this.speed * this.p5.cos(this.direction);
    this.y += this.speed * this.p5.sin(this.direction);
    
    // Change légèrement la direction pour créer un mouvement plus naturel
    this.direction += this.p5.random(-0.05, 0.05);
    
    // Rebond sur les bords
    if (this.x < 0 || this.x > this.p5.width) {
      this.direction = this.p5.PI - this.direction;
    }
    
    if (this.y < 0 || this.y > this.p5.height) {
      this.direction = -this.direction;
    }
    
    // Fluctuation de taille et opacité pour effet de scintillement
    this.size += this.p5.random(-0.1, 0.1);
    this.size = this.p5.constrain(this.size, 1.5, 6);
    
    this.alpha += this.p5.random(-5, 5);
    this.alpha = this.p5.constrain(this.alpha, 100, 200);
  }

  display() {
    this.p5.noStroke();
    const c = this.p5.color(this.color);
    c.setAlpha(this.alpha);
    this.p5.fill(c);
    this.p5.ellipse(this.x, this.y, this.size);
  }
}

interface P5CanvasProps {
  className?: string;
}

const P5Canvas: React.FC<P5CanvasProps> = ({ className }) => {
  const particles: ParticleType[] = [];
  const particleCount = 100;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    
    // Création des particules
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(p5));
    }
  };

  const draw = (p5: p5Types) => {
    p5.clear();
    
    // Mise à jour et affichage des particules
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].display();
    }
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <div className={className}>
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
};

export default P5Canvas;


import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  opacity: number;
  yVelocity: number;
  xVelocity: number;
  rotationSpeed: number;
}

interface ConfettiProps {
  fire: boolean;
  count?: number;
}

const createParticle = (id: number): Particle => ({
  id,
  x: Math.random() * 100, // as vw
  y: -10, // as vh
  rotation: Math.random() * 360,
  scale: Math.random() * 0.5 + 0.5,
  color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  opacity: 1,
  yVelocity: Math.random() * 3 + 2,
  xVelocity: Math.random() * 4 - 2,
  rotationSpeed: Math.random() * 10 - 5,
});

const Confetti: React.FC<ConfettiProps> = ({ fire, count = 100 }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (fire) {
      const newParticles = Array.from({ length: count }, (_, i) => createParticle(i));
      setParticles(newParticles);
      
      const animationFrame = requestAnimationFrame(updateParticles);

      return () => {
        cancelAnimationFrame(animationFrame);
        setParticles([]);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire, count]);

  const updateParticles = () => {
    setParticles(prevParticles => {
      const updated = prevParticles.map(p => ({
        ...p,
        y: p.y + p.yVelocity,
        x: p.x + p.xVelocity,
        rotation: p.rotation + p.rotationSpeed,
        opacity: p.y < 100 ? p.opacity : 0,
      })).filter(p => p.opacity > 0);

      if (updated.length > 0) {
        requestAnimationFrame(updateParticles);
      }
      
      return updated;
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-5"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            transition: 'opacity 0.5s ease-out'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;

import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingScreen.module.css';

interface ParticleProps {
  left: number;
  delay: number;
  size: number;
  duration: number;
  bottom: number;
  icon: string;
  startFromTop: boolean;
  targetBottom: number;
  id: number;
}

const Particle: React.FC<ParticleProps> = ({ left, delay, size, duration, bottom, icon, targetBottom, id }) => {
  // Utilisation de useRef pour la référence DOM
  const particleRef = useRef<HTMLDivElement>(null);
  
  // Animation d'entrée
  useEffect(() => {
    if (particleRef.current) {
      // Définir la position finale après un court délai pour déclencher la transition
      setTimeout(() => {
        if (particleRef.current) {
          particleRef.current.style.bottom = `${targetBottom}%`;
        }
      }, 50);
    }
  }, [targetBottom]);
  
  // Styles dynamiques pour la particule
  const particleStyle: React.CSSProperties = {
    left: `${left}%`,
    bottom: `${bottom}%`,
    width: `${size}px`,
    height: `${size}px`,
    transition: `bottom ${duration}s ease-in-out ${delay}s, opacity 0.5s ease`,
    animation: `float ${duration}s infinite ease-in-out ${delay}s`,
  };

  return (
    <div 
      ref={particleRef}
      className={`${styles.particle} ${styles['particle-float']}`}
      style={particleStyle}
      data-id={id}
    >
      <span className={styles.particleIcon}>{icon}</span>
    </div>
  );
};

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  useEffect(() => {
    const duration = 5000; // 5 secondes
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const newProgress = Math.min(100, ((now - startTime) / duration) * 100);
      setProgress(newProgress);

      if (now < endTime) {
        requestAnimationFrame(updateProgress);
      } else {
        setShow(false);
        onComplete();
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      // Nettoyage
    };
  }, [onComplete]);

  if (!show) return null;

  // Génération des particules avec plus de variété
  const particles = [];
  const particleCount = 16; // Plus de particules pour un effet plus riche
  
  // Plus grande variété d'icônes scolaires
  const schoolIcons = [
    '📚', '✏️', '📝', '📖', '📓', '📌', '📎', '📏',
    '📐', '✂️', '🎨', '📊', '📝', '📚', '📒', '📕',
    '📗', '📘', '📙', '📔', '📒', '📋', '📁', '📂',
    '📅', '📆', '📝', '📌', '📍', '📎', '✏️', '✒️',
    '📝', '📜', '📄', '📑', '📰', '📘', '📙', '📚'
  ];

  // Fonction pour obtenir une icône aléatoire
  const getRandomIcon = () => {
    return schoolIcons[Math.floor(Math.random() * schoolIcons.length)];
  };

  // Création des particules avec des positions aléatoires sur tout l'écran
  for (let i = 0; i < particleCount; i++) {
    const size = 16 + Math.random() * 24; // Taille plus variée
    const delay = Math.random() * 5; // Délais d'animation variés
    const duration = 4 + Math.random() * 6; // Durées d'animation variées
    
    // Position aléatoire sur tout l'écran (0-100% pour left, 0-100% pour bottom)
    const left = 5 + Math.random() * 90; // 5-95% pour éviter les bords
    const targetBottom = 5 + Math.random() * 90; // Position cible aléatoire
    
    // Animation de départ aléatoire (certaines commencent en haut, d'autres en bas)
    const startFromTop = Math.random() > 0.5;
    const startPosition = startFromTop ? 110 : -10;
    
    // Création de la particule avec animation de déplacement vertical
    particles.push({
      id: i,
      left: left,
      delay: delay,
      size: size,
      duration: duration,
      bottom: startPosition, // Position de départ (hors écran)
      targetBottom: targetBottom, // Position cible
      icon: getRandomIcon(),
      startFromTop: startFromTop
    });
  }

  return (
    <div className={styles.loadingContainer}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          id={particle.id}
          left={particle.left}
          delay={particle.delay}
          size={particle.size}
          duration={particle.duration}
          bottom={particle.bottom}
          targetBottom={particle.targetBottom}
          startFromTop={particle.startFromTop}
          icon={particle.icon}
        />
      ))}
      
      <div className={styles.logo}>Academia Hub</div>
      <div className={styles.loadingText}>Chargement de Academia Hub...</div>
      <div className={styles.loadingBar}>
        <div 
          ref={progressRef}
          className={`${styles.progress} progress-${Math.floor(progress)}`}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;

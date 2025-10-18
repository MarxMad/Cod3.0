'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import type { Variants } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin,
  Zap,
  Target,
  Clock,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Coffee,
  Car,
  ParkingMeter,
  Utensils,
  Shield,
  Building,
  Navigation,
  User,
  Award,
  Heart
} from 'lucide-react';
// import LazySplineScene from '../components/LazySplineScene';

// Prize data adapted for the animation
const prizes: [string, number, number, string, string][] = [
  ["🏆", 340, 10, "1er Lugar", "$25,000"],
  ["🥈", 20, 40, "2do Lugar", "$15,000"],
  ["🥉", 60, 90, "3er Lugar", "$10,000"],
];

interface PrizeCardProps {
  emoji: string;
  hueA: number;
  hueB: number;
  title: string;
  prize: string;
  i: number;
}

function PrizeCard({ emoji, hueA, hueB, title, prize, i }: PrizeCardProps) {
  const background = `linear-gradient(306deg, hsl(${hueA}, 100%, 50%), hsl(${hueB}, 100%, 50%))`;

  return (
    <motion.div
      className={`prize-card-${i}`}
      style={{
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        paddingTop: 20,
        marginBottom: -120,
      }}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <div 
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
          background 
        }} 
      />
      <motion.div 
        style={{
          fontSize: 164,
          width: 300,
          height: 430,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          background: "#1a1a1a",
          boxShadow: "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
          transformOrigin: "10% 60%",
          border: "2px solid rgba(34, 197, 94, 0.3)",
        }} 
        variants={cardVariants} 
        className="prize-card"
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>{emoji}</div>
        <div style={{ 
          fontSize: 24, 
          fontWeight: "bold", 
          color: "white", 
          textAlign: "center",
          marginBottom: 10 
        }}>
          {title}
        </div>
        <div style={{ 
          fontSize: 32, 
          fontWeight: "black", 
          color: "#22c55e", 
          textAlign: "center" 
        }}>
          {prize}
        </div>
      </motion.div>
    </motion.div>
  );
}

const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

function PrizesAnimation() {
  return (
    <div style={{
      margin: "50px auto",
      maxWidth: 500,
      paddingBottom: 100,
      width: "100%",
    }}>
      {prizes.map(([emoji, hueA, hueB, title, prize], i) => (
        <PrizeCard 
          key={title}
          emoji={emoji} 
          hueA={hueA} 
          hueB={hueB} 
          title={title}
          prize={prize}
          i={i} 
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('home');
  const [isClient, setIsClient] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carrusel de imágenes
  const galleryImages = [
    {
      src: '/Espectacular.jpeg',
      alt: 'Parque Bicentenario - Vista Aérea',
      title: 'Parque Bicentenario',
      description: 'Ubicación icónica en el corazón de CDMX'
    },
    {
      src: '/Led.jpeg',
      alt: 'Área de Trabajo Tech',
      title: 'Área de Trabajo',
      description: 'Espacios modernos para desarrollo'
    },
    {
      src: '/Letra.jpeg',
      alt: 'Ambiente Innovador',
      title: 'Ambiente Innovador',
      description: 'Perfecto para hackathons tecnológicos'
    },
    {
      src: '/Stage.jpeg',
      alt: 'Auditorio Principal',
      title: 'Auditorio Principal',
      description: 'Ceremonias y presentaciones'
    },
    {
      src: '/Stage2.jpeg',
      alt: 'Área de Networking',
      title: 'Área de Networking',
      description: 'Espacios para colaboración y conexión'
    }
  ];

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Auto-advance carrusel
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  // Duplicar contenido del ticker automáticamente para efecto infinito seamless
  useEffect(() => {
    const tickerTrack = document.querySelector('.ticker-track.allies-fast');
    if (tickerTrack && tickerTrack.children.length > 0) {
      const items = Array.from(tickerTrack.children);
      items.forEach(item => {
        const clone = item.cloneNode(true);
        tickerTrack.appendChild(clone);
      });
    }
  }, [isClient]);

  const hackathonDate = new Date('2026-03-27T09:00:00');
  const timeLeft = hackathonDate.getTime() - currentTime.getTime();
  
  const days = isClient ? Math.floor(timeLeft / (1000 * 60 * 60 * 24)) : 0;
  const hours = isClient ? Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0;
  const minutes = isClient ? Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)) : 0;
  const seconds = isClient ? Math.floor((timeLeft % (1000 * 60)) / 1000) : 0;

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const glowAnimation = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(34, 197, 94, 0.3)",
        "0 0 40px rgba(34, 197, 94, 0.6)",
        "0 0 20px rgba(34, 197, 94, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
      <div className="min-h-screen bg-black relative overflow-hidden pixel-grid">
        {/* Matrix Rain Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 text-xs font-mono opacity-20"
              style={{
                left: `${(i * 2) % 100}%`,
                animationDelay: `${(i * 0.1) % 2}s`,
              }}
              animate={{
                y: [0, "100vh"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i * 0.1) % 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {String.fromCharCode(0x30A0 + (i * 3) % 96)}
            </motion.div>
          ))}
          
          {/* Floating Pixels */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400"
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 5) % 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + (i * 0.15) % 3,
                repeat: Infinity,
                delay: (i * 0.1) % 2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Tech Grid Lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-px bg-green-400"
                style={{ top: `${i * 4}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-full w-px bg-green-400"
                style={{ left: `${i * 4}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-xl border-b-2 border-green-400 scan-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-16 h-16">
        <Image
                  src="/CODEB.png"
                  alt="CODEB Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'schedule', 'prizes', 'sponsors', 'register'].map((section) => (
                <motion.a
                  key={section}
                  href={`#${section}`}
                  className={`text-gray-300 hover:text-green-400 transition-colors relative font-mono ${
                    activeSection === section ? 'text-green-400' : ''
                  }`}
                  onClick={() => setActiveSection(section)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {section === 'home' && '<INICIO/>'}
                  {section === 'about' && '<ACERCA/>'}
                  {section === 'schedule' && '<PROGRAMA/>'}
                  {section === 'prizes' && '<PREMIOS/>'}
                  {section === 'sponsors' && '<SPONSORS/>'}
                  {section === 'register' && '<REGISTRO/>'}
                  {activeSection === section && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-green-400"
                      layoutId="activeSection"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            <motion.a
              href="/registro"
              className="tech-button px-4 py-2 text-sm font-bold transition-all duration-300 inline-block"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              &lt;REGÍSTRATE/&gt;
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Cool Design con Logo Grande */}
      <section id="home" className="pt-24 sm:pt-32 pb-8 sm:pb-16 px-8 sm:px-12 lg:px-16 relative min-h-screen overflow-hidden">
        {/* Fondo con efectos sutiles - Responsive */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Ondas animadas - más visibles en móvil */}
          {[...Array(2)].map((_, i) => (
          <motion.div
              key={i}
              className="absolute w-full h-full"
              style={{
                background: `radial-gradient(circle at ${30 + i * 40}% ${40 + i * 20}%, rgba(0, 255, 0, 0.08) 0%, transparent 60%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
            />
          ))}
          
          
          {/* Scanlines sutiles - más visibles en móvil */}
          <div className="absolute inset-0 pointer-events-none opacity-10 sm:opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.3) 2px, rgba(0, 255, 0, 0.3) 4px)',
            }} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-0">
          {/* Banner SVG Background - Solo Desktop */}
          <div className="absolute inset-0 pointer-events-none hidden sm:block">
            <Image
              src="/banner.svg"
              alt="Banner"
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>
          
          {/* Two Column Layout - Responsive */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[80vh] relative z-10">
            {/* Mobile: Logo First, Desktop: Left Column */}
            <motion.div
              className="lg:hidden space-y-6 sm:space-y-8 order-1"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Mobile Logo */}
                <motion.div 
                className="relative text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="relative w-full h-[200px] sm:h-[250px]"
                  variants={floatingAnimation}
                  initial="initial"
                  animate="animate"
                >
                <Image
                      src="/CODEB.png"
                    alt="COD3.0 Logo"
                      fill
                      className="object-contain drop-shadow-2xl"
                    priority
                    />
                </motion.div>
              </motion.div>
                </motion.div>
                
            {/* Left Column - HACKATHON Title + Countdown */}
            <motion.div
              className="space-y-6 sm:space-y-8 order-2 lg:order-1"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* HACKATHON Title - una línea */}
              <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-green-400 mb-4 leading-tight"
              variants={fadeInUp}
            >
                HACKATHON
            </motion.h1>
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-cyan-400 font-semibold mb-6"
                  variants={fadeInUp}
                >
                  27-29 MARZO 2026
                </motion.p>
                <motion.p 
                  className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-mono max-w-xl"
                  variants={fadeInUp}
                >
                  El evento de programación más innovador del año. 
                  Construye el futuro con código, creatividad y colaboración.
                </motion.p>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div 
                className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-xl"
                variants={fadeInUp}
              >
                {[
                  { value: days, label: 'DÍAS' },
                  { value: hours, label: 'HORAS' },
                  { value: minutes, label: 'MIN' },
                  { value: seconds, label: 'SEG' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="tech-card p-3 sm:p-4 md:p-5 relative overflow-hidden group"
                    variants={glowAnimation}
                    initial="initial"
                    animate="animate"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                    
                    <div className="relative z-10 text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-green-400 mb-1 group-hover:text-white transition-colors duration-300 font-mono">
                        {isClient ? item.value : '--'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 font-medium group-hover:text-gray-200 transition-colors duration-300 font-mono">{item.label}</div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>

              {/* Action Buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                variants={fadeInUp}
              >
                <motion.a
                  href="/registro"
                  className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <span>&lt;REGÍSTRATE/&gt;</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.a>
                
                <motion.button
                  className="group relative bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm overflow-hidden"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                  />
                  <span className="relative z-10">&lt;PROGRAMA/&gt;</span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Column - Logo Grande COD3.0 - Desktop Only */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Efectos de resplandor detrás del logo */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-cyan-400/20 to-green-400/20 rounded-full blur-3xl"
              animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                  duration: 3,
                repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Logo flotante */}
          <motion.div
                variants={floatingAnimation}
                initial="initial"
                animate="animate"
                className="relative"
              >
                <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
                  <Image
                    src="/CODEB.png"
                    alt="COD3.0 Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
            </motion.div>
            
              {/* Anillo orbital sutil */}
                  <motion.div
                className="absolute inset-0 border border-green-400/10 rounded-full"
                style={{ transform: 'scale(1.15)' }}
                animate={{
                  rotate: 360,
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
                    </motion.div>
                  </div>
                    </div>
      </section>

      {/* Combined About & Schedule Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-32 px-6 sm:px-8 lg:px-12 bg-black relative">
        {/* Simple grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        

        <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-0">
          {/* Header */}
            <motion.div
            initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4">
              TRES DÍAS <span className="text-green-400">INTENSOS</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">Una experiencia inmersiva donde cada momento cuenta</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                <Zap className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">48 Horas de Código</span>
                    </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-gray-300">15+ Charlas & Workshops</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">30 Actividades</span>
              </div>
            </div>
                    </motion.div>
                    
          {/* Timeline Connector - Suave */}
          <div className="hidden md:flex items-center justify-center mb-8 relative">
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
            <div className="flex justify-between w-full max-w-4xl relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-black"></div>
                <span className="text-xs text-blue-400 mt-2 font-bold">INICIO</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-black"></div>
                <span className="text-xs text-green-400 mt-2 font-bold">DESARROLLO</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-black"></div>
                <span className="text-xs text-purple-400 mt-2 font-bold">CIERRE</span>
              </div>
                  </div>
                    </div>
                    
          {/* 3 Cards Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 px-4 sm:px-0">
            {[
              {
                    day: "27 MARZO",
                    subtitle: "Día 1 - Inicio",
                events: [
                  "09:00 - Registro y Check-in",
                  "10:00 - Ceremonia de Apertura",
                  "11:00 - Presentación de Desafíos",
                  "12:00 - Formación de Equipos",
                  "13:00 - ¡Comienza la Programación!",
                  "14:00 - Charla: Web3 y Blockchain",
                  "16:00 - Workshop: Git & GitHub",
                  "18:00 - Networking & Pizza",
                  "20:00 - Charla: IA en el Desarrollo",
                  "22:00 - Programación Nocturna"
                ],
                    color: "blue"
              },
              {
                    day: "28 MARZO",
                    subtitle: "Día 2 - Desarrollo",
                events: [
                  "00:00 - Programación Continúa",
                  "08:00 - Desayuno & Networking",
                  "10:00 - Charla: Cloud & DevOps",
                  "12:00 - Mentoring Sessions",
                  "14:00 - Comida & Relax",
                  "15:00 - Charla: UX/UI Best Practices",
                  "17:00 - Workshop: APIs & Microservicios",
                  "18:00 - Networking Event",
                  "20:00 - Charlas Lightning (5 charlas)",
                  "22:00 - Programación Final Sprint"
                ],
                    highlight: true,
                    color: "green"
              },
              {
                    day: "29 MARZO",
                    subtitle: "Día 3 - Finalización",
                events: [
                  "09:00 - Últimas Horas de Código",
                  "11:00 - Preparación de Demos",
                  "12:00 - Deadline de Entrega",
                  "13:00 - Comida de Cierre",
                  "14:00 - Presentaciones Pitch (30 equipos)",
                  "16:00 - Evaluación del Jurado",
                  "17:00 - Networking Final",
                  "18:00 - Ceremonia de Premiación",
                  "19:30 - Fotos & Celebración",
                  "20:00 - 🎸 Concierto de Cierre"
                ],
                    color: "purple"
              }
            ].map((dayData, index) => (
              <motion.div
                key={dayData.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                  dayData.highlight 
                    ? 'bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/20' 
                    : 'bg-gray-900/80 border-gray-700/50'
                } hover:scale-102 hover:shadow-lg`}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                          <Calendar className={`h-6 w-6 ${dayData.highlight ? 'text-green-400' : 'text-gray-400'}`} />
                    {dayData.highlight && (
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 font-bold">
                        24H CODING
                      </span>
                    )}
                          </div>
                  <h3 className={`text-2xl font-black mb-1 ${dayData.highlight ? 'text-green-400' : 'text-white'}`}>
                    {dayData.day}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{dayData.subtitle}</p>
                  
                  {/* Activity count badges */}
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
                      {dayData.events.filter(e => e.includes('Charla')).length} Charlas
                    </span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                      {dayData.events.filter(e => e.includes('Workshop')).length} Workshops
                    </span>
                        </div>
                  </div>
                  
                {/* Events */}
                      <div className="space-y-3">
                  {dayData.events.map((event, i) => {
                    // Determinar icono según el tipo de evento
                    let EventIcon = Clock;
                    let iconColor = dayData.highlight ? 'text-green-400' : 'text-gray-500';
                    
                    if (event.includes('Charla')) {
                      EventIcon = Zap;
                      iconColor = 'text-cyan-400';
                    } else if (event.includes('Workshop')) {
                      EventIcon = Target;
                      iconColor = 'text-blue-400';
                    } else if (event.includes('Networking') || event.includes('Desayuno') || event.includes('Comida')) {
                      EventIcon = Users;
                      iconColor = 'text-orange-400';
                    } else if (event.includes('Mentoring')) {
                      EventIcon = Star;
                      iconColor = 'text-yellow-400';
                    } else if (event.includes('Concierto')) {
                      EventIcon = Sparkles;
                      iconColor = 'text-purple-400';
                    }
                    
                    return (
                      <div key={i} className="flex items-start text-sm group/item hover:translate-x-1 transition-all duration-500 ease-in-out">
                        <EventIcon className={`h-4 w-4 mr-3 flex-shrink-0 mt-0.5 ${iconColor} transition-colors duration-300`} />
                        <span className="text-gray-300 group-hover/item:text-white transition-colors duration-500">{event}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
              </div>

          {/* Closing Concert Section */}
                      <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
                        viewport={{ once: true }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 border-2 border-purple-500/50"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-purple-400 mr-3" />
                <h3 className="text-3xl md:text-4xl font-black text-white">
                  CONCIERTO DE <span className="text-purple-400">CIERRE</span>
                </h3>
                <Sparkles className="h-8 w-8 text-purple-400 ml-3" />
                  </div>
              <p className="text-xl text-gray-300 mb-6">
                ¡Celebra el final del hackathon con música en vivo!
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                  29 de Marzo - 20:00 hrs
              </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                  Parque Bicentenario - Escenario Principal
          </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-400" />
                  Evento abierto a todos los participantes
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prizes Section - Animated Cards */}
      <section id="prizes" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-purple-900/20 to-black relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <Trophy className="h-5 w-5" />
              <span className="font-semibold">Premios Increíbles</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Más de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400">
                $50,000
              </span>{' '}
              en premios
            </h2>
            
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Para los mejores proyectos que marquen la diferencia
            </p>
          </motion.div>

          {/* Animated Prize Cards */}
          <PrizesAnimation />
        </div>
      </section>

      {/* Sponsors & Allies Section - ULTRA COOL */}
      <section id="sponsors" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-black via-purple-900/20 to-black">
        {/* Epic Background Effects */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Floating Particles */}
          {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
                style={{
                left: `${(i * 3.33) % 100}%`,
                top: `${(i * 3.33) % 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20, 0],
                }}
                transition={{
                duration: 4 + (i * 0.1) % 3,
                  repeat: Infinity,
                  delay: (i * 0.1) % 2,
                }}
              />
            ))}
          
          {/* Glowing Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-0">
          {/* Epic Header */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 px-8 py-4 rounded-full mb-8 border-2 border-purple-400/30 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(147,51,234,0.3)" }}
            >
              <Sparkles className="h-6 w-6" />
              <span className="font-black text-lg tracking-wider">INVERSIONISTAS ESTRATÉGICOS</span>
              <Sparkles className="h-6 w-6" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight">
              EMPRESAS QUE{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
                  APOYAN
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-purple-400/20 rounded-xl"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </span>{' '}
              LA INNOVACIÓN
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Colaboramos con las empresas más innovadoras del mundo tech para crear el futuro
            </p>
          </motion.div>

          {/* Main Sponsors - ULTRA COOL DISPLAY */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-purple-400 mb-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
              </div>
                <span className="text-center">PATROCINADORES PRINCIPALES</span>
            </h3>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
            </motion.div>
            
            {/* 3 Main Static Sponsors - RESPONSIVE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-16 px-4 sm:px-0">
              {/* Starlink - Platinum - ULTRA COOL */}
                <motion.div
                initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <motion.div
                  className="relative bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500 h-full overflow-hidden shadow-2xl shadow-yellow-500/10"
                  whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px rgba(234,179,8,0.3)" }}
                    initial={false}
                  >
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-[2px] bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-2xl rounded-2xl" />
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-yellow-600/5 rounded-2xl" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="mb-6 h-20 sm:h-24 flex items-center justify-center">
                        <Image
                        src="/SponsorsPlatinum/Starlink_Logo.svg" 
                        alt="Starlink" 
                        width={180} 
                        height={90}
                        priority={true}
                        loading="eager"
                        className="mx-auto group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    <h4 className="text-xl sm:text-2xl font-black text-yellow-400 mb-2 group-hover:scale-105 transition-transform duration-300">
                      STARLINK
                      </h4>
                    <p className="text-yellow-300 font-bold text-xs sm:text-sm tracking-wider">
                      PATROCINADOR PLATINO
                      </p>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
                    </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
          </motion.div>

              {/* Placeholder Sponsor 2 - ULTRA COOL */}
          <motion.div
                initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  className="relative bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border-2 border-green-400/30 hover:border-green-400/60 transition-all duration-500 h-full overflow-hidden shadow-2xl shadow-green-500/10"
                  whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px rgba(34,197,94,0.3)" }}
                  initial={false}
                >
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-[2px] bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-2xl rounded-2xl" />
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-green-600/5 rounded-2xl" />
              </div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="mb-6 h-20 sm:h-24 flex items-center justify-center">
                      <div className="w-32 h-16 bg-green-400/20 rounded-lg flex items-center justify-center border-2 border-dashed border-green-400/40 group-hover:border-green-400/60 transition-colors duration-300">
                        <span className="text-green-400 font-bold text-xs sm:text-sm">PRÓXIMAMENTE</span>
                      </div>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-green-400 mb-2 group-hover:scale-105 transition-transform duration-300">
                      SPONSOR 2
                    </h4>
                    <p className="text-green-300 font-bold text-xs sm:text-sm tracking-wider">
                      PATROCINADOR ORO
                    </p>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-green-300 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>

              {/* Placeholder Sponsor 3 - ULTRA COOL */}
                <motion.div
                initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <motion.div
                  className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border-2 border-blue-400/30 hover:border-blue-400/60 transition-all duration-500 h-full overflow-hidden shadow-2xl shadow-blue-500/10"
                  whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px rgba(59,130,246,0.3)" }}
                    initial={false}
                  >
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-[2px] bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-2xl rounded-2xl" />
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-blue-600/5 rounded-2xl" />
                      </div>
                      
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="mb-6 h-20 sm:h-24 flex items-center justify-center">
                      <div className="w-32 h-16 bg-blue-400/20 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-400/40 group-hover:border-blue-400/60 transition-colors duration-300">
                        <span className="text-blue-400 font-bold text-xs sm:text-sm">PRÓXIMAMENTE</span>
                      </div>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-blue-400 mb-2 group-hover:scale-105 transition-transform duration-300">
                      SPONSOR 3
                      </h4>
                    <p className="text-blue-300 font-bold text-xs sm:text-sm tracking-wider">
                      PATROCINADOR ORO
                      </p>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
                    </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </motion.div>
            </div>

          </motion.div>


          {/* Strategic Partners - Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-blue-400 text-center mb-8 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              Aliados Estratégicos
            </h3>
            
            <div className="ticker-container">
              <div className="ticker-track allies-fast">
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/ANGULO.png" 
                    alt="Ángulo" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">Ángulo</p>
                </div>
                <div className="ticker-item large">
                        <Image
                    src="/Aliados/CHIPIPAY.svg" 
                    alt="ChipiPay" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">ChipiPay</p>
                      </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/FOUNDERS.png" 
                    alt="Founders" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">Founders</p>
                    </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/goblin-logo-02.PNG" 
                    alt="Goblin" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">Goblin</p>
                </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/HERDAO.png" 
                    alt="HERDAO" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">HERDAO</p>
                </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/Logo_ww_blanco.png" 
                    alt="WomanWay" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">WomanWay</p>
                </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/MEDIOLANO.svg" 
                    alt="Mediolano" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">Mediolano</p>
                </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/OMIS.jpeg" 
                    alt="OMIS" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">OMIS</p>
                </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/restake-watch.PNG" 
                    alt="Restake Watch" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">Restake Watch</p>
                </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/UnionCampesinaDemocratica.jpeg" 
                    alt="Unión Campesina Democrática" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">Unión Campesina Democrática</p>
                </div>
                <div className="ticker-item large">
                  <Image 
                    src="/Aliados/CriptoUNAM.png" 
                    alt="CriptoUNAM" 
                    width={200} 
                    height={100}
                    loading="lazy"
                    className="ticker-logo"
                  />
                  <p className="ticker-name">CriptoUNAM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Become a Sponsor CTA */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.div
              className="bg-black/60 backdrop-blur-xl rounded-2xl p-10 border border-green-400/30 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 1 }}
              />
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">
                  ¿Quieres ser parte de COD3.0?
                </h3>
                <p className="text-sm text-gray-300 mb-6 max-w-xl mx-auto">
                  Únete a nuestro ecosistema de patrocinadores y ayuda a construir el futuro de la tecnología
                </p>
                
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Conviértete en Patrocinador
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-black via-purple-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full mb-6 border border-green-400/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Galería del Evento</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Espacios{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400">
                espectaculares
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Descubre los increíbles espacios donde se desarrollará el COD3.0 HACKATHON
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-green-400/30 overflow-hidden">
              {/* Main Image Display */}
              <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-6">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={galleryImages[currentImageIndex].src}
                    alt={galleryImages[currentImageIndex].alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{galleryImages[currentImageIndex].title}</h3>
                    <p className="text-gray-200">{galleryImages[currentImageIndex].description}</p>
                  </div>
                </motion.div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Thumbnail Navigation */}
              <div className="flex justify-center space-x-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      currentImageIndex === index 
                        ? 'ring-2 ring-green-400 scale-110' 
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Venue Section - ULTRA COOL & RESPONSIVE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-black via-blue-900/20 to-black overflow-hidden">
        {/* Epic Background Effects */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-0">
          {/* Epic Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 px-8 py-4 rounded-full mb-8 border-2 border-blue-400/30 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
            >
              <Building className="h-6 w-6" />
              <span className="font-black text-lg tracking-wider">VENUE & UBICACIÓN</span>
              <MapPin className="h-6 w-6" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              PARQUE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                BICENTENARIO
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Un espacio icónico en el corazón de la Ciudad de México, diseñado para la innovación tecnológica
            </p>
          </motion.div>

          {/* New Synthesized Layout with Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/mapa.svg"
                  alt="Mapa del Parque Bicentenario"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Overlay with Venue Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating Info Card */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 bg-blue-500/20 backdrop-blur-xl rounded-xl p-4 border border-blue-400/30"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <h4 className="text-white font-bold">Parque Bicentenario</h4>
                    </div>
                  <p className="text-gray-300 text-sm">
                    Av. Río San Joaquín 200, CDMX<br />
                    <span className="text-blue-400 font-semibold">Zona Polanco</span>
                  </p>
                </motion.div>
                  </div>
            </motion.div>

            {/* Right Side - Synthesized Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Key Info Card */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-400/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Building className="h-6 w-6 mr-3 text-blue-400" />
                  INFORMACIÓN CLAVE
                </h3>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {[
                    { icon: Navigation, text: "Dirección", subtext: "Polanco, CDMX" },
                    { icon: Car, text: "Estacionamiento", subtext: "Gratuito" },
                    { icon: Wifi, text: "Internet", subtext: "1Gbps" },
                    { icon: Coffee, text: "Servicios", subtext: "24/7" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-black/20 rounded-xl p-4 text-center hover:bg-black/30 transition-colors duration-300"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <item.icon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-white font-bold text-sm">{item.text}</div>
                      <div className="text-gray-400 text-xs">{item.subtext}</div>
                    </motion.div>
                  ))}
                    </div>
                  </div>
                  
              {/* Features Card */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-400/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-3 text-green-400" />
                  CARACTERÍSTICAS
                </h3>
                
                <div className="space-y-3">
                  {[
                    "🌐 Internet 1Gbps ultra rápido",
                    "🍕 Cafetería 24/7 disponible",
                    "🚗 Estacionamiento gratuito",
                    "🛡️ Seguridad 24/7",
                    "🏥 Servicios médicos",
                    "💻 Áreas de trabajo tech"
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                    </div>
                  </div>
            </motion.div>
                </div>
              </div>
      </section>

      {/* Organizers Section - TEAM BEHIND THE MAGIC */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-black via-purple-900/20 to-black overflow-hidden">
        {/* Epic Background Effects */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Floating Orbs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-0">
          {/* Epic Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
              viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-8 py-4 rounded-full mb-8 border-2 border-purple-400/30 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Heart className="h-6 w-6" />
              <span className="font-bold text-lg">EQUIPO ORGANIZADOR</span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              LOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                VISIONARIOS
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Conoce al equipo que está construyendo el futuro de la programación en México
            </p>
          </motion.div>

          {/* Organizers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 px-4 sm:px-0 max-w-6xl mx-auto">
            {[
              {
                name: "Kinari Sabina",
                role: "Co-Founder & Strategy",
                description: "Estratega innovadora especializada en desarrollo de ecosistemas tech",
                image: "/Organizadores/kinari-sabina.jpg",
                social: {
                  twitter: "#",
                  linkedin: "#",
                  github: "#"
                }
              },
              {
                name: "Fernanda Tello",
                role: "Head of Operations",
                description: "Experta en operaciones y gestión de eventos tecnológicos de gran escala",
                image: "/Organizadores/fernanda-tello.jpg",
                social: {
                  twitter: "#",
                  linkedin: "#",
                  github: "#"
                }
              },
              {
                name: "Gerardo Vela",
                role: "Lead Developer & CTO",
                description: "Desarrollador full-stack y arquitecto de soluciones tecnológicas avanzadas",
                image: "/Organizadores/gerardo-vela.jpg",
                social: {
                  twitter: "#",
                  linkedin: "#",
                  github: "#"
                }
              }
            ].map((organizer, index) => (
              <motion.div
                key={organizer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-102 shadow-lg hover:shadow-purple-500/20"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Photo */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      <User className="h-12 w-12 text-purple-400" />
                    </div>
                  </div>
                  
                  {/* Decorative Ring - Simplified */}
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400/30" />
                </div>

                {/* Info */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {organizer.name}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400 font-semibold text-sm">
                      {organizer.role}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {organizer.description}
                  </p>
                  
                  {/* Social Links - Simplified */}
                  <div className="flex items-center justify-center space-x-3 pt-2">
                    <a
                      href={organizer.social.twitter}
                      className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors duration-300 hover:scale-105"
                    >
                      <Twitter className="h-4 w-4 text-purple-400" />
                    </a>
                    <a
                      href={organizer.social.linkedin}
                      className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors duration-300 hover:scale-105"
                    >
                      <Linkedin className="h-4 w-4 text-purple-400" />
                    </a>
                    <a
                      href={organizer.social.github}
                      className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors duration-300 hover:scale-105"
                    >
                      <Github className="h-4 w-4 text-purple-400" />
                    </a>
                  </div>
                </div>

                {/* Hover Effect - Simplified */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
          </div>

          {/* Call to Action */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-400/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿Quieres ser parte del equipo?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Estamos siempre buscando talento excepcional para unirse a nuestra misión de transformar la educación tecnológica en México.
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105">
                Únete al Equipo
              </button>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-black via-green-900/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <Users className="h-5 w-5" />
              <span className="font-semibold">¡Únete a COD3.0!</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              No te pierdas la oportunidad de ser parte del{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400">
                hackathon más innovador
              </span>{' '}
              del año
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Construye el futuro con nosotros
            </p>

            {/* New Two-Column Layout with Banner */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Banner */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="/bannersito.svg"
                    alt="COD3.0 Hackathon Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-4 right-4 bg-green-400/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/30"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-green-400 font-bold text-sm">¡GRATIS!</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Synthesized Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Event Info Card */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-400/20">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Calendar className="h-6 w-6 mr-3 text-green-400" />
                    Información del Evento
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {[
                      { icon: Calendar, text: "27-29 Marzo", subtext: "2026" },
                      { icon: Clock, text: "48 horas", subtext: "continuas" },
                      { icon: MapPin, text: "Parque", subtext: "Bicentenario" },
                      { icon: Users, text: "Máx 4", subtext: "por equipo" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="bg-black/20 rounded-xl p-4 text-center hover:bg-black/30 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <item.icon className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <div className="text-white font-bold text-sm">{item.text}</div>
                        <div className="text-gray-400 text-xs">{item.subtext}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-400/20">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Star className="h-6 w-6 mr-3 text-blue-400" />
                    ¿Qué Incluye?
                  </h3>
                  <div className="space-y-3">
                    {[
                      "🔧 APIs y herramientas premium",
                      "👨‍💼 Mentoring con expertos",
                      "🍕 Comida y bebidas",
                      "🤝 Networking empresarial",
                      "🏆 Certificado de participación"
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              </div>

            {/* Registration Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.a
                href="/registro"
                className="bg-green-500 hover:bg-green-600 text-white px-16 py-5 rounded-full font-bold text-2xl transition-all duration-300 shadow-2xl hover:shadow-green-500/30 relative overflow-hidden group inline-block"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
                <span className="relative z-10">¡Regístrate Ahora - Gratis!</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 border-t border-green-500/20 py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 px-4 sm:px-0">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-14 h-14">
          <Image
                    src="/CODEB.png"
                    alt="CODEB Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-3xl font-bold text-white">COD3.0</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                El hackathon más innovador del año, donde la creatividad y la tecnología se encuentran.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 text-lg">Evento</h3>
              <ul className="space-y-3 text-gray-300">
                                 {[
                   { href: "#about", text: "Acerca de" },
                   { href: "#schedule", text: "Programa" },
                   { href: "#prizes", text: "Premios" },
                   { href: "#sponsors", text: "Patrocinadores" },
                   { href: "#register", text: "Registro" }
                 ].map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a href={link.href} className="hover:text-green-400 transition-colors duration-300">
                      {link.text}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 text-lg">Recursos</h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  "Documentación",
                  "APIs Disponibles",
                  "Mentores",
                  "FAQ"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a href="#" className="hover:text-green-400 transition-colors duration-300">
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 text-lg">Síguenos</h3>
              <div className="flex space-x-4">
                {[
                  { icon: Github, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300 p-2 rounded-full hover:bg-green-500/10"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <social.icon className="h-6 w-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            className="border-t border-green-500/20 mt-12 pt-8 text-center text-gray-300"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2026 COD3.0 Hackathon. Todos los derechos reservados.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

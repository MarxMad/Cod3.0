'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
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
  Navigation
} from 'lucide-react';
import SplineScene from '../components/SplineScene';

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
      alt: 'Espectacular WTC CDMX',
      title: 'Espectacular WTC CDMX',
      description: '70m x 10m - Máxima visibilidad'
    },
    {
      src: '/Led.jpeg',
      alt: 'Panel LED',
      title: 'Panel LED',
      description: '100cm x 50cm - Tecnología de vanguardia'
    },
    {
      src: '/Letra.jpeg',
      alt: 'Letra 400K30',
      title: 'Letra 400K30',
      description: 'Iluminación LED - Impacto visual'
    },
    {
      src: '/Stage.jpeg',
      alt: 'Stage Principal',
      title: 'Stage Principal',
      description: 'Evento Exterior - Espectacular'
    },
    {
      src: '/Stage2.jpeg',
      alt: 'Stage Interior',
      title: 'Stage Interior',
      description: 'WEB3 HACKATHON - Ambiente tech'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Auto-advance carrusel
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  const hackathonDate = new Date('2024-12-15T09:00:00');
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
              <div className="relative w-12 h-12">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              &lt;REGÍSTRATE/&gt;
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Floating Logo */}
            <motion.div 
              className="flex justify-center mb-8"
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64">
            <Image
                  src="/CODEB.png"
                  alt="CODEB Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 tech-title leading-tight"
              variants={fadeInUp}
            >
              &lt;COD3.0
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 animate-pulse">
                HACKATHON
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed font-mono px-4"
              variants={fadeInUp}
            >
              El evento de programación más innovador del año. 
              Construye el futuro con código, creatividad y colaboración.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 px-4"
              variants={fadeInUp}
            >
              <motion.a
                href="/registro"
                className="tech-button px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl flex items-center space-x-2 sm:space-x-3 relative overflow-hidden group w-full sm:w-auto justify-center inline-block"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 text-center">&lt;REGÍSTRATE/&gt;</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 relative z-10" />
              </motion.a>
              
              <motion.button
                className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 font-bold text-base sm:text-lg md:text-xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden group font-mono w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 text-center">&lt;PROGRAMA/&gt;</span>
              </motion.button>
            </motion.div>

            {/* Enhanced Countdown Timer */}
            <motion.div 
              className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4"
              variants={fadeInUp}
            >
              {[
                { value: days, label: 'DÍAS', color: 'green' },
                { value: hours, label: 'HORAS', color: 'cyan' },
                { value: minutes, label: 'MIN', color: 'purple' },
                { value: seconds, label: 'SEG', color: 'pink' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="tech-card p-2 sm:p-4 md:p-6 relative overflow-hidden group min-w-0"
                  variants={glowAnimation}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  <div className="relative z-10 text-center">
                    <div className="text-lg sm:text-2xl md:text-4xl font-black text-green-400 mb-1 sm:mb-2 group-hover:text-white transition-colors duration-300 font-mono leading-tight">
                      {isClient ? item.value : '--'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 font-medium group-hover:text-gray-200 transition-colors duration-300 font-mono leading-tight">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 relative">
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
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">¿Qué es COD3.0?</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Un hackathon de 48 horas donde la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                innovación
              </span>{' '}
              se encuentra con la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                tecnología
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Desarrolladores, diseñadores y emprendedores se unen para crear soluciones 
              innovadoras que cambien el mundo digital.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Innovación",
                description: "Explora las últimas tecnologías y frameworks para crear soluciones que marquen la diferencia en el mundo digital.",
                color: "green"
              },
              {
                icon: Users,
                title: "Colaboración",
                description: "Trabaja en equipo con otros desarrolladores talentosos y aprende de diferentes perspectivas y habilidades.",
                color: "blue"
              },
              {
                icon: Target,
                title: "Impacto",
                description: "Construye proyectos que resuelvan problemas reales y tengan un impacto positivo en la sociedad.",
                color: "green"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-500 h-full"
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={false}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500/20 to-${item.color === 'green' ? 'blue' : 'green'}-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className={`h-8 w-8 text-${item.color}-400`} />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">Programa del Evento</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Tres días intensos de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                programación
              </span>{' '}
              y aprendizaje
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Una experiencia inmersiva donde cada momento cuenta
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                day: "Día 1",
                events: [
                  "09:00 - Registro y Check-in",
                  "10:00 - Ceremonia de Apertura",
                  "11:00 - Presentación de Desafíos",
                  "12:00 - Formación de Equipos",
                  "13:00 - ¡Comienza la Programación!"
                ],
                highlight: false
              },
              {
                day: "Día 2",
                events: [
                  "00:00 - Programación Continúa",
                  "12:00 - Mentoring Sessions",
                  "18:00 - Networking Event",
                  "20:00 - Charlas Técnicas",
                  "24:00 - Programación Nocturna"
                ],
                highlight: true
              },
              {
                day: "Día 3",
                events: [
                  "09:00 - Últimas Horas",
                  "12:00 - Deadline de Entrega",
                  "14:00 - Presentaciones",
                  "16:00 - Evaluación del Jurado",
                  "18:00 - Ceremonia de Premiación"
                ],
                highlight: false
              }
            ].map((dayData, index) => (
              <motion.div
                key={dayData.day}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  className={`backdrop-blur-xl rounded-2xl p-8 border transition-all duration-500 h-full ${
                    dayData.highlight
                      ? 'bg-green-500/20 border-green-400/40 hover:border-green-400/60'
                      : 'bg-black/40 border-green-500/20 hover:border-green-500/40'
                  }`}
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={false}
                >
                  <div className="flex items-center mb-6">
                    <Calendar className={`h-8 w-8 mr-3 ${dayData.highlight ? 'text-green-400' : 'text-blue-400'}`} />
                    <h3 className="text-2xl font-bold text-white">{dayData.day}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {dayData.events.map((event, eventIndex) => (
                      <motion.div
                        key={eventIndex}
                        className="flex items-center text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: eventIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Clock className="h-4 w-4 mr-3 text-green-400" />
                        <span>{event}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-purple-900/20 to-black relative">
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
              transition={{ duration: 0.6, delay: 0.2 }}
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

          {/* Two Column Layout: Spline + Prizes */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Spline 3D Scene */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden border border-purple-400/30"
            >
              <SplineScene 
                sceneUrl="https://prod.spline.design/2q0dmovGgiPvvFq5/scene.splinecode"
                className="w-full h-full"
              />
            </motion.div>

            {/* Prizes Cards */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
            {[
              {
                place: "1er Lugar",
                prize: "$25,000",
                color: "green",
                benefits: [
                  "Premio en efectivo",
                  "Mentoring con expertos",
                  "Incubación de startup",
                  "Viaje a conferencia tech"
                ]
              },
              {
                place: "2do Lugar",
                prize: "$15,000",
                color: "cyan",
                benefits: [
                  "Premio en efectivo",
                  "Acceso a coworking",
                  "Networking premium",
                  "Certificaciones tech"
                ]
              },
              {
                place: "3er Lugar",
                prize: "$10,000",
                color: "purple",
                benefits: [
                  "Premio en efectivo",
                  "Cursos online premium",
                  "Hardware de desarrollo",
                  "Membresía a comunidad"
                ]
              }
            ].map((prize, index) => (
              <motion.div
                key={prize.place}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  className={`bg-gradient-to-br from-${prize.color}-500/20 to-${prize.color === 'green' ? 'blue' : 'green'}-500/20 backdrop-blur-xl rounded-xl p-6 border border-${prize.color}-400/30 hover:border-${prize.color}-400/60 transition-all duration-300`}
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={false}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br from-${prize.color}-500/30 to-${prize.color === 'green' ? 'blue' : 'green'}-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Trophy className={`h-8 w-8 text-${prize.color}-400`} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-1 group-hover:text-green-400 transition-colors duration-300">
                        {prize.place}
                      </h3>
                      
                      <p className={`text-3xl font-black text-${prize.color}-400 mb-3 group-hover:scale-105 transition-transform duration-300`}>
                        {prize.prize}
                      </p>
                      
                      <ul className="space-y-2">
                        {prize.benefits.map((benefit, benefitIndex) => (
                          <motion.li
                            key={benefitIndex}
                            className="text-gray-300 flex items-center group-hover:text-gray-200 transition-colors duration-300 text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: benefitIndex * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <Star className="h-3 w-3 mr-2 text-green-400 flex-shrink-0" />
                            <span>{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsors & Allies Section */}
      <section id="sponsors" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-black via-cyan-900/10 to-black">
        {/* Animated Tech Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full"
                style={{
                  left: `${(i * 5) % 100}%`,
                  top: `${(i * 5) % 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + (i * 0.1) % 2,
                  repeat: Infinity,
                  delay: (i * 0.1) % 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full mb-6 border border-green-400/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Star className="h-5 w-5" />
              <span className="font-semibold">Patrocinadores & Aliados</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Empresas que{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">apoyan</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </span>{' '}
              la innovación
            </h2>
            
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Colaboramos con las empresas más innovadoras del mundo tech
            </p>
          </motion.div>

          {/* Platinum Sponsors */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-green-400 text-center mb-8 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mr-3 flex items-center justify-center">
                <Star className="h-4 w-4 text-black" />
              </div>
              Patrocinadores Platino
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "TechCorp", logo: "TC", description: "Líder en innovación tecnológica" },
                { name: "InnovateLab", logo: "IL", description: "Laboratorio de ideas del futuro" },
                { name: "FutureTech", logo: "FT", description: "Construyendo el mañana" }
              ].map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <motion.div
                    className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-green-400/30 h-full relative overflow-hidden"
                    whileHover={{ y: -10, scale: 1.02 }}
                    initial={false}
                  >
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300 border border-green-400/30">
                        <span className="text-2xl font-bold text-green-400">{sponsor.logo}</span>
                      </div>
                      
                      <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                        {sponsor.name}
                      </h4>
                      
                      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {sponsor.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gold Sponsors */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-yellow-400 text-center mb-8 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mr-3 flex items-center justify-center">
                <Star className="h-4 w-4 text-black" />
              </div>
              Patrocinadores Oro
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "CodeFlow", logo: "CF", description: "Flujo de código inteligente" },
                { name: "DataVault", logo: "DV", description: "Seguridad de datos avanzada" },
                { name: "CloudSync", logo: "CS", description: "Sincronización en la nube" },
                { name: "AI Nexus", logo: "AN", description: "Centro de inteligencia artificial" }
              ].map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <motion.div
                    className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-yellow-400/20 h-full relative overflow-hidden"
                    whileHover={{ y: -5, scale: 1.01 }}
                    initial={false}
                  >
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-all duration-300 border border-yellow-400/20">
                        <span className="text-xl font-bold text-yellow-400">{sponsor.logo}</span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                        {sponsor.name}
                      </h4>
                      
                      <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {sponsor.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Strategic Partners */}
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
            
            <div className="grid md:grid-cols-6 gap-4">
              {[
                "DevHub", "TechStart", "InnovateX", "CodeCraft", "FutureLab", "DataFlow"
              ].map((partner, index) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <motion.div
                    className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-blue-400/20 text-center relative overflow-hidden"
                    whileHover={{ y: -3, scale: 1.05 }}
                    initial={false}
                  >
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/20">
                        <span className="text-sm font-bold text-blue-400">{partner.slice(0, 2)}</span>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {partner}
                      </h4>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
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
                <h3 className="text-3xl font-bold text-white mb-4">
                  ¿Quieres ser parte de COD3.0?
                </h3>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Únete a nuestro ecosistema de patrocinadores y ayuda a construir el futuro de la tecnología
                </p>
                
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25"
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
              transition={{ duration: 0.6, delay: 0.2 }}
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

      {/* Venue Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-black via-pink-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-full mb-6 border border-blue-400/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Building className="h-5 w-5" />
              <span className="font-semibold">Venue & Ubicación</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Centro de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-pink-400">
                Innovación Tech
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Un espacio diseñado para la innovación y la creatividad tecnológica
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Venue Info */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/30">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <MapPin className="h-8 w-8 mr-3 text-blue-400" />
                  Información del Venue
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Navigation className="h-6 w-6 mr-4 text-blue-400 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Dirección</h4>
                      <p className="text-gray-300">Centro de Innovación Tech<br />Av. Tecnología 123, CDMX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Car className="h-6 w-6 mr-4 text-blue-400 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Estacionamiento</h4>
                      <p className="text-gray-300">Estacionamiento gratuito disponible<br />Capacidad para 200+ vehículos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Wifi className="h-6 w-6 mr-4 text-blue-400 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Conectividad</h4>
                      <p className="text-gray-300">Internet de alta velocidad (1Gbps)<br />Red WiFi dedicada para participantes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Utensils className="h-6 w-6 mr-4 text-blue-400 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Servicios</h4>
                      <p className="text-gray-300">Cafetería 24/7, áreas de descanso<br />Servicios médicos de emergencia</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Venue Features */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Wifi, title: "Internet 1Gbps", description: "Conexión ultra rápida" },
                  { icon: Coffee, title: "Cafetería 24/7", description: "Comida y bebidas" },
                  { icon: ParkingMeter, title: "Estacionamiento", description: "200+ espacios" },
                  { icon: Shield, title: "Seguridad 24/7", description: "Vigilancia completa" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-blue-400/20 text-center hover:border-blue-400/40 transition-all duration-300 hover:scale-105"
                  >
                    <feature.icon className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
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
              transition={{ duration: 0.6, delay: 0.2 }}
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

            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-10 border border-green-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-2 gap-10 mb-10">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Calendar className="h-6 w-6 mr-3 text-green-400" />
                    Información del Evento
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    {[
                      { icon: Calendar, text: "15-17 de Diciembre, 2024" },
                      { icon: Clock, text: "48 horas continuas" },
                      { icon: MapPin, text: "Centro de Innovación Tech" },
                      { icon: Users, text: "Máximo 4 personas por equipo" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <item.icon className="h-5 w-5 mr-3 text-green-400" />
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Star className="h-6 w-6 mr-3 text-green-400" />
                    ¿Qué Incluye?
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    {[
                      "Acceso a APIs y herramientas premium",
                      "Mentoring con expertos de la industria",
                      "Comida y bebidas durante el evento",
                      "Networking con empresas tech",
                      "Certificado de participación"
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-green-400 mr-3 text-xl">✓</span>
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

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
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-10 h-10">
          <Image
                    src="/CODEB.png"
                    alt="CODEB Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-white">COD3.0</span>
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
                    initial={{ opacity: 0, y: 20 }}
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
            initial={{ opacity: 0, y: 20 }}
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

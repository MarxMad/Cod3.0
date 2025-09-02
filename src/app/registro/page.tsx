'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowLeft, 
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    universidad: '',
    carrera: '',
    github: '',
    linkedin: '',
    portfolio: '',
    experiencia: 'principiante',
    equipo: 'individual',
    nombreEquipo: '',
    integrantes: [],
    proyecto: '',
    motivacion: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

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

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden pixel-grid">
        {/* Matrix Rain Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 text-xs font-mono opacity-20"
              style={{
                left: `${(i * 3.33) % 100}%`,
                animationDelay: `${(i * 0.067) % 2}s`,
              }}
              animate={{
                y: [0, "100vh"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i * 0.067) % 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Floating Pixels */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30"
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 5) % 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + (i * 0.1) % 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Tech Grid Lines */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-green-400/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-400/5 via-transparent to-green-400/5" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="mb-8"
              variants={fadeInUp}
            >
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tech-title">
                ¡REGISTRO EXITOSO!
              </h1>
              <p className="text-xl text-gray-300 mb-8 font-mono">
                Tu registro para COD3.0 HACKATHON ha sido confirmado
              </p>
            </motion.div>

            <motion.div
              className="bg-black/50 backdrop-blur-md border-2 border-green-400 p-8 rounded-lg mb-8"
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold text-green-400 mb-4">Próximos Pasos:</h2>
              <ul className="text-left text-gray-300 space-y-3 font-mono">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Recibirás un email de confirmación en las próximas 24 horas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Te enviaremos información sobre el evento y tu equipo</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Prepárate para el hackathon más innovador del año</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeInUp}
            >
              <Link
                href="/"
                className="tech-button px-8 py-4 text-lg font-bold inline-flex items-center space-x-3"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Inicio</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pixel-grid">
              {/* Matrix Rain Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 text-xs font-mono opacity-20"
              style={{
                left: `${(i * 3.33) % 100}%`,
                animationDelay: `${(i * 0.067) % 2}s`,
              }}
              animate={{
                y: [0, "100vh"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i * 0.067) % 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Floating Pixels */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30"
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 5) % 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + (i * 0.1) % 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

      {/* Tech Grid Lines */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-green-400/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-400/5 via-transparent to-green-400/5" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-green-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3 group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-12 h-12">
                <Image
                  src="/CODEB.png"
                  alt="CODEB Logo"
                  fill
                  className="object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                />
              </div>
              <span className="text-2xl font-bold text-white font-mono group-hover:text-green-400 transition-colors duration-300">
                COD3.0
              </span>
            </motion.div>

            <motion.div
              className="tech-button px-4 py-2 text-sm font-bold transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              &lt;VOLVER/&gt;
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
            >
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tech-title">
                &lt;REGISTRO/&gt;
              </h1>
              <p className="text-xl text-gray-300 font-mono max-w-3xl mx-auto">
                Únete al hackathon más innovador del año. Construye el futuro con código, 
                creatividad y colaboración.
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="mb-8"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-400 font-mono">Paso {step} de 3</span>
                <span className="text-gray-400 font-mono">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  className="bg-green-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="bg-black/50 backdrop-blur-md border-2 border-green-400 p-8 rounded-lg"
              variants={fadeInUp}
            >
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                      &lt;INFORMACIÓN PERSONAL/&gt;
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Nombre *</label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="Tu nombre"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Apellido *</label>
                        <input
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="Tu apellido"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="tu@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Teléfono</label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="+1234567890"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Universidad/Institución</label>
                        <input
                          type="text"
                          name="universidad"
                          value={formData.universidad}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="Nombre de tu universidad"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Carrera/Estudios</label>
                        <input
                          type="text"
                          name="carrera"
                          value={formData.carrera}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="Tu carrera o campo de estudio"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                      &lt;PERFIL TÉCNICO/&gt;
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Nivel de Experiencia *</label>
                        <select
                          name="experiencia"
                          value={formData.experiencia}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                        >
                          <option value="principiante">Principiante</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                          <option value="experto">Experto</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">GitHub</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="https://github.com/tuusuario"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">LinkedIn</label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="https://linkedin.com/in/tuusuario"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Portfolio/Website</label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                          placeholder="https://tuwebsite.com"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                      &lt;PROYECTO & MOTIVACIÓN/&gt;
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Tipo de Participación *</label>
                        <select
                          name="equipo"
                          value={formData.equipo}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                        >
                          <option value="individual">Individual</option>
                          <option value="equipo">Con Equipo</option>
                        </select>
                      </div>
                      
                      {formData.equipo === 'equipo' && (
                        <div>
                          <label className="block text-green-400 font-mono mb-2">Nombre del Equipo</label>
                          <input
                            type="text"
                            name="nombreEquipo"
                            value={formData.nombreEquipo}
                            onChange={handleInputChange}
                            className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors"
                            placeholder="Nombre de tu equipo"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Idea de Proyecto</label>
                        <textarea
                          name="proyecto"
                          value={formData.proyecto}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors resize-none"
                          placeholder="Describe brevemente tu idea de proyecto para el hackathon..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-400 font-mono mb-2">Motivación para Participar *</label>
                        <textarea
                          name="motivacion"
                          value={formData.motivacion}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full bg-black/50 border-2 border-green-400/50 text-white px-4 py-3 rounded font-mono focus:border-green-400 focus:outline-none transition-colors resize-none"
                          placeholder="¿Por qué quieres participar en COD3.0? ¿Qué esperas aprender o lograr?"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-6 py-3 font-bold transition-all duration-300 font-mono"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    &lt;ANTERIOR/&gt;
                  </motion.button>
                )}
                
                {step < 3 ? (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="tech-button px-6 py-3 font-bold font-mono"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    &lt;SIGUIENTE/&gt;
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="tech-button px-8 py-3 text-lg font-bold font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>ENVIANDO...</span>
                      </span>
                    ) : (
                      '&lt;COMPLETAR REGISTRO/&gt;'
                    )}
                  </motion.button>
                )}
              </div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

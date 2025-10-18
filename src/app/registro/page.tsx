'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowLeft, 
  CheckCircle,
  User,
  Mail,
  Phone,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Users,
  Lightbulb,
  Target,
  Sparkles,
  Zap,
  Shield,
  Star
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
    console.log('🚀 Iniciando envío del formulario...');
    console.log('📋 Datos del formulario:', formData);
    
    // Validar campos requeridos
    const camposRequeridos = [
      { campo: 'nombre', label: 'Nombre' },
      { campo: 'apellido', label: 'Apellido' },
      { campo: 'email', label: 'Email' },
      { campo: 'experiencia', label: 'Nivel de experiencia' },
      { campo: 'equipo', label: 'Tipo de participación' },
      { campo: 'motivacion', label: 'Motivación' }
    ];
    
    const camposFaltantes = camposRequeridos.filter(({ campo }) => {
      const valor = formData[campo as keyof typeof formData];
      return !valor || valor.toString().trim() === '';
    });
    
    if (camposFaltantes.length > 0) {
      const nombresCampos = camposFaltantes.map(({ label }) => label).join(', ');
      alert(`Por favor completa los siguientes campos requeridos: ${nombresCampos}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('📤 Enviando datos a la API...');
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Respuesta recibida:', response.status, response.statusText);
      const result = await response.json();
      console.log('📄 Resultado:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el registro');
      }

      // Registro exitoso
      console.log('✅ Registro exitoso!');
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error('❌ Error:', error);
      setIsSubmitting(false);
      alert(error instanceof Error ? error.message : 'Error al enviar el registro');
    }
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
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Enhanced Matrix Rain Background */}
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
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400"
              style={{
                left: `${(i * 3.33) % 100}%`,
                top: `${(i * 3.33) % 100}%`,
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
        </div>

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

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="mb-12"
              variants={fadeInUp}
            >
              <motion.div
                className="relative mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="w-32 h-32 text-green-400 mx-auto drop-shadow-2xl" />
                <motion.div
                  className="absolute inset-0 bg-green-400/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl font-black text-white mb-6 tech-title"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(34, 197, 94, 0.3)",
                    "0 0 40px rgba(34, 197, 94, 0.6)",
                    "0 0 20px rgba(34, 197, 94, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ¡REGISTRO EXITOSO!
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-300 mb-8 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Tu registro para COD3.0 HACKATHON ha sido confirmado
              </motion.p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-black/60 via-green-900/20 to-black/60 backdrop-blur-xl border-2 border-green-400/50 p-10 rounded-2xl mb-12 relative overflow-hidden"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-green-400 mb-8 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 mr-3" />
                  Próximos Pasos
                  <Sparkles className="w-8 h-8 ml-3" />
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Mail,
                      title: "Email de Confirmación",
                      description: "Recibirás un email de confirmación en las próximas 24 horas",
                      color: "blue"
                    },
                    {
                      icon: Users,
                      title: "Información del Equipo",
                      description: "Te enviaremos información sobre el evento y tu equipo",
                      color: "green"
                    },
                    {
                      icon: Zap,
                      title: "Prepárate para la Innovación",
                      description: "Prepárate para el hackathon más innovador del año",
                      color: "purple"
                    }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br from-${step.color}-500/20 to-${step.color === 'blue' ? 'green' : step.color === 'green' ? 'purple' : 'blue'}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-${step.color}-400/30`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <step.icon className={`w-8 h-8 text-${step.color}-400`} />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-5 rounded-xl font-bold text-xl inline-flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <ArrowLeft className="w-6 h-6 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="relative z-10">Volver al Inicio</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Matrix Rain Background */}
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
        </div>

      {/* Floating Tech Elements */}
        <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
            className="absolute w-1 h-1 bg-green-400"
              style={{
              left: `${(i * 3.33) % 100}%`,
              top: `${(i * 3.33) % 100}%`,
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
        </div>

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

      {/* Enhanced Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b-2 border-green-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-4 group"
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

            <motion.button
              className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>&lt;VOLVER/&gt;</span>
              </span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Enhanced Header */}
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
            >
              <motion.div
                className="inline-flex items-center space-x-3 bg-green-500/20 text-green-400 px-8 py-4 rounded-full mb-8 border border-green-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className="h-6 w-6" />
                <span className="font-semibold text-lg">Únete al Futuro</span>
                <Sparkles className="h-6 w-6" />
              </motion.div>
              
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 sm:mb-8 tech-title"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(34, 197, 94, 0.3)",
                    "0 0 40px rgba(34, 197, 94, 0.6)",
                    "0 0 20px rgba(34, 197, 94, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                &lt;REGISTRO/&gt;
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl text-gray-300 font-mono max-w-4xl mx-auto leading-relaxed px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Únete al hackathon más innovador del año. Construye el futuro con código, 
                creatividad y colaboración.
              </motion.p>
            </motion.div>



            {/* Enhanced Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-black/60 via-green-900/10 to-black/60 backdrop-blur-xl border-2 border-green-400/50 p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl relative overflow-hidden mx-4 sm:mx-0"
              variants={fadeInUp}
              noValidate
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10 space-y-8 sm:space-y-10 md:space-y-12">
                {/* Información Personal */}
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-green-400/30 group-hover:scale-110 transition-transform duration-300">
                      <User className="w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono group-hover:text-green-400 transition-colors duration-300">
                      &lt;INFORMACIÓN PERSONAL/&gt;
                    </h2>
                    </div>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {[
                      { name: 'nombre', label: 'Nombre', icon: User, required: true, placeholder: 'Tu nombre' },
                      { name: 'apellido', label: 'Apellido', icon: User, required: true, placeholder: 'Tu apellido' },
                      { name: 'email', label: 'Email', icon: Mail, required: true, placeholder: 'tu@email.com', type: 'email' },
                      { name: 'telefono', label: 'Teléfono', icon: Phone, required: false, placeholder: '+1234567890', type: 'tel' },
                      { name: 'universidad', label: 'Universidad/Institución', icon: GraduationCap, required: false, placeholder: 'Nombre de tu universidad' },
                      { name: 'carrera', label: 'Carrera/Estudios', icon: GraduationCap, required: false, placeholder: 'Tu carrera o campo de estudio' }
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        className="group/field"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <label className="block text-green-400 font-mono mb-2 sm:mb-3 text-sm sm:text-base md:text-lg font-semibold flex items-center space-x-2">
                          <field.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>{field.label} {field.required && <span className="text-red-400">*</span>}</span>
                        </label>
                        <div className="relative">
                      <input
                            type={field.type || 'text'}
                            name={field.name}
                            value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                            required={field.required}
                            className="w-full bg-black/50 border-2 border-green-400/50 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl font-mono focus:border-green-400 focus:outline-none transition-all duration-300 hover:border-green-400/70 focus:bg-black/70 group-hover/field:scale-[1.02] text-sm sm:text-base"
                            placeholder={field.placeholder}
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent -skew-x-12 rounded-xl"
                            initial={{ x: "-100%" }}
                            whileFocus={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                      />
                    </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Perfil Técnico */}
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono group-hover:text-blue-400 transition-colors duration-300">
                    &lt;PERFIL TÉCNICO/&gt;
                  </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {[
                      { 
                        name: 'experiencia', 
                        label: 'Nivel de Experiencia', 
                        icon: Target, 
                        required: true, 
                        type: 'select',
                        options: [
                          { value: 'principiante', label: 'Principiante' },
                          { value: 'intermedio', label: 'Intermedio' },
                          { value: 'avanzado', label: 'Avanzado' },
                          { value: 'experto', label: 'Experto' }
                        ]
                      },
                      { name: 'github', label: 'GitHub', icon: Github, required: false, placeholder: 'https://github.com/tuusuario' },
                      { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, required: false, placeholder: 'https://linkedin.com/in/tuusuario' },
                      { name: 'portfolio', label: 'Portfolio/Website', icon: Globe, required: false, placeholder: 'https://tuwebsite.com' }
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        className="group/field"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <label className="block text-blue-400 font-mono mb-2 sm:mb-3 text-sm sm:text-base md:text-lg font-semibold flex items-center space-x-2">
                          <field.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>{field.label} {field.required && <span className="text-red-400">*</span>}</span>
                        </label>
                        <div className="relative">
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name as keyof typeof formData]}
                              onChange={handleInputChange}
                              required={field.required}
                              className="w-full bg-black/50 border-2 border-blue-400/50 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl font-mono focus:border-blue-400 focus:outline-none transition-all duration-300 hover:border-blue-400/70 focus:bg-black/70 group-hover/field:scale-[1.02] text-sm sm:text-base"
                            >
                              {field.options?.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                      </select>
                          ) : (
                      <input
                        type="text"
                              name={field.name}
                              value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                              required={field.required}
                              className="w-full bg-black/50 border-2 border-blue-400/50 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl font-mono focus:border-blue-400 focus:outline-none transition-all duration-300 hover:border-blue-400/70 focus:bg-black/70 group-hover/field:scale-[1.02] text-sm sm:text-base"
                              placeholder={field.placeholder}
                            />
                          )}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -skew-x-12 rounded-xl"
                            initial={{ x: "-100%" }}
                            whileFocus={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                      />
                    </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Proyecto & Motivación */}
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-400/30 group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono group-hover:text-purple-400 transition-colors duration-300">
                    &lt;PROYECTO & MOTIVACIÓN/&gt;
                  </h2>
                  </div>
                  
                  <div className="space-y-6 sm:space-y-8">
                    <motion.div
                      className="group/field"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-purple-400 font-mono mb-2 sm:mb-3 text-sm sm:text-base md:text-lg font-semibold flex items-center space-x-2">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Tipo de Participación <span className="text-red-400">*</span></span>
                      </label>
                      <div className="relative">
                      <select
                        name="equipo"
                        value={formData.equipo}
                        onChange={handleInputChange}
                        required
                          className="w-full bg-black/50 border-2 border-purple-400/50 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl font-mono focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-400/70 focus:bg-black/70 group-hover/field:scale-[1.02] text-sm sm:text-base"
                      >
                        <option value="individual">Individual</option>
                        <option value="equipo">Con Equipo</option>
                      </select>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -skew-x-12 rounded-xl"
                          initial={{ x: "-100%" }}
                          whileFocus={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                    </div>
                    </motion.div>
                    
                    {formData.equipo === 'equipo' && (
                      <motion.div
                        className="group/field"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-purple-400 font-mono mb-2 sm:mb-3 text-sm sm:text-base md:text-lg font-semibold flex items-center space-x-2">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Nombre del Equipo</span>
                        </label>
                        <div className="relative">
                        <input
                          type="text"
                          name="nombreEquipo"
                          value={formData.nombreEquipo}
                          onChange={handleInputChange}
                            className="w-full bg-black/50 border-2 border-purple-400/50 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl font-mono focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-400/70 focus:bg-black/70 group-hover/field:scale-[1.02] text-sm sm:text-base"
                          placeholder="Nombre de tu equipo"
                        />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -skew-x-12 rounded-xl"
                            initial={{ x: "-100%" }}
                            whileFocus={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                          />
                      </div>
                      </motion.div>
                    )}
                    
                    <motion.div
                      className="group/field"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-purple-400 font-mono mb-2 sm:mb-3 text-sm sm:text-base md:text-lg font-semibold flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Idea de Proyecto</span>
                      </label>
                      <div className="relative">
                      <textarea
                        name="proyecto"
                        value={formData.proyecto}
                        onChange={handleInputChange}
                        rows={4}
                          className="w-full bg-black/50 border-2 border-purple-400/50 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl font-mono focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-400/70 focus:bg-black/70 resize-none group-hover/field:scale-[1.02] text-sm sm:text-base"
                        placeholder="Describe brevemente tu idea de proyecto para el hackathon..."
                      />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -skew-x-12 rounded-xl"
                          initial={{ x: "-100%" }}
                          whileFocus={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                    </div>
                    </motion.div>
                    
                    <motion.div
                      className="group/field"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-purple-400 font-mono mb-2 sm:mb-3 text-sm sm:text-base md:text-lg font-semibold flex items-center space-x-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Motivación para Participar <span className="text-red-400">*</span></span>
                      </label>
                      <div className="relative">
                      <textarea
                        name="motivacion"
                        value={formData.motivacion}
                        onChange={handleInputChange}
                        required
                        rows={4}
                          className="w-full bg-black/50 border-2 border-purple-400/50 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl font-mono focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-400/70 focus:bg-black/70 resize-none group-hover/field:scale-[1.02] text-sm sm:text-base"
                        placeholder="¿Por qué quieres participar en COD3.0? ¿Qué esperas aprender o lograr?"
                      />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -skew-x-12 rounded-xl"
                          initial={{ x: "-100%" }}
                          whileFocus={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                    </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Submit Button */}
              <motion.div 
                className="flex justify-center mt-8 sm:mt-10 md:mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-2xl font-bold text-lg sm:text-xl md:text-2xl transition-all duration-300 shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05, y: -3 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 rounded-2xl"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  {isSubmitting ? (
                    <span className="relative z-10 flex items-center space-x-4">
                      <motion.div
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>ENVIANDO REGISTRO...</span>
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center space-x-3">
                      <Shield className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      <span>&lt;COMPLETAR REGISTRO/&gt;</span>
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

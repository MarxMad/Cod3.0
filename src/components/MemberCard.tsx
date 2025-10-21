'use client';

import { motion } from 'framer-motion';
import { User, Award, Twitter, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';

interface Member {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  category: 'organizer' | 'sponsor' | 'mentor' | 'participant';
}

interface MemberCardProps {
  member: Member;
  index: number;
}

export default function MemberCard({ member, index }: MemberCardProps) {
  return (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-102 shadow-lg hover:shadow-purple-500/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Category Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          member.category === 'organizer' ? 'bg-purple-500/20 text-purple-400' :
          member.category === 'sponsor' ? 'bg-green-500/20 text-green-400' :
          member.category === 'mentor' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {member.category === 'organizer' ? 'Organizador' :
           member.category === 'sponsor' ? 'Sponsor' :
           member.category === 'mentor' ? 'Mentor' :
           'Participante'}
        </span>
      </div>
      
      {/* Photo */}
      <div className="relative mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1 group-hover:scale-110 transition-transform duration-500">
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-purple-400" />
            )}
          </div>
        </div>
        
        {/* Decorative Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-400/30" />
      </div>

      {/* Info */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
          {member.name}
        </h3>
        
        <div className="flex items-center justify-center space-x-2">
          <Award className="h-4 w-4 text-purple-400" />
          <span className="text-purple-400 font-semibold text-sm">
            {member.role}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed">
          {member.description}
        </p>
        
        {/* Social Links */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          {member.social.twitter && (
            <a
              href={member.social.twitter}
              className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors duration-300 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4 text-purple-400" />
            </a>
          )}
          {member.social.linkedin && (
            <a
              href={member.social.linkedin}
              className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors duration-300 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4 text-purple-400" />
            </a>
          )}
          {member.social.github && (
            <a
              href={member.social.github}
              className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors duration-300 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 text-purple-400" />
            </a>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

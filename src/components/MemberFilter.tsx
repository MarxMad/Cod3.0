'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Category = 'all' | 'organizer' | 'sponsor' | 'mentor' | 'participant';

interface MemberFilterProps {
  onFilterChange: (category: Category) => void;
  activeFilter: Category;
}

const filterOptions = [
  { key: 'all' as Category, label: 'Todos', icon: '👥' },
  { key: 'organizer' as Category, label: 'Organizadores', icon: '🎯' },
  { key: 'sponsor' as Category, label: 'Sponsors', icon: '💎' },
  { key: 'mentor' as Category, label: 'Mentores', icon: '🧠' },
  { key: 'participant' as Category, label: 'Participantes', icon: '🚀' },
];

export default function MemberFilter({ onFilterChange, activeFilter }: MemberFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {filterOptions.map((option) => (
        <motion.button
          key={option.key}
          onClick={() => onFilterChange(option.key)}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
            activeFilter === option.key
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">{option.icon}</span>
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

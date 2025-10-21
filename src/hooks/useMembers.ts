'use client';

import { useState, useEffect } from 'react';

export interface Member {
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

type Category = 'all' | 'organizer' | 'sponsor' | 'mentor' | 'participant';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [loading, setLoading] = useState(true);

  // Datos hardcodeados por ahora - en el futuro esto vendrá de una API
  const defaultMembers: Member[] = [
    {
      id: '1',
      name: 'Kinari Sabina',
      role: 'Co-Founder & Strategy',
      description: 'Estratega innovadora especializada en desarrollo de ecosistemas tech',
      image: '/Organizadores/kinari-sabina.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      },
      category: 'organizer'
    },
    {
      id: '2',
      name: 'Fernanda Tello',
      role: 'Head of Operations',
      description: 'Experta en operaciones y gestión de eventos tecnológicos de gran escala',
      image: '/Organizadores/fernanda-tello.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      },
      category: 'organizer'
    },
    {
      id: '3',
      name: 'Gerardo Vela',
      role: 'Lead Developer & CTO',
      description: 'Desarrollador full-stack y arquitecto de soluciones tecnológicas avanzadas',
      image: '/Organizadores/gerardo-vela.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      },
      category: 'organizer'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    const loadMembers = async () => {
      setLoading(true);
      
      // TODO: En el futuro, esto vendrá de una API
      // const response = await fetch('/api/members');
      // const data = await response.json();
      
      // Por ahora usar datos hardcodeados
      setMembers(defaultMembers);
      setFilteredMembers(defaultMembers);
      setLoading(false);
    };

    loadMembers();
  }, []);

  const filterMembers = (category: Category) => {
    setActiveFilter(category);
    
    if (category === 'all') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member => member.category === category);
      setFilteredMembers(filtered);
    }
  };

  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString()
    };
    
    setMembers(prev => [...prev, newMember]);
    
    // Actualizar filtro si es necesario
    if (activeFilter === 'all' || activeFilter === member.category) {
      setFilteredMembers(prev => [...prev, newMember]);
    }
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    );
    
    setFilteredMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
    setFilteredMembers(prev => prev.filter(member => member.id !== id));
  };

  return {
    members: filteredMembers,
    allMembers: members,
    activeFilter,
    loading,
    filterMembers,
    addMember,
    updateMember,
    deleteMember
  };
}

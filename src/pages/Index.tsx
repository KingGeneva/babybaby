
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import LazyLoadedSections from '@/components/home/LazyLoadedSections';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  const { user } = useAuth();
  const [childProfiles, setChildProfiles] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Données de démonstration pour les utilisateurs non connectés
  const demoGrowthData = [
    { name: '1 mois', taille: 52, poids: 4.1 },
    { name: '2 mois', taille: 56, poids: 5.2 },
    { name: '3 mois', taille: 59, poids: 6.0 },
    { name: '4 mois', taille: 62, poids: 6.7 },
    { name: '5 mois', taille: 65, poids: 7.3 },
    { name: '6 mois', taille: 67, poids: 7.8 },
  ];

  // Charger les données utilisateur si connecté
  useEffect(() => {
    if (user) {
      async function loadUserData() {
        setLoading(true);
        try {
          // Récupérer les profils d'enfants de l'utilisateur
          const { data: profiles } = await supabase
            .from('child_profiles')
            .select('*')
            .limit(1);

          if (profiles && profiles.length > 0) {
            setChildProfiles(profiles);

            // Récupérer les données de croissance du premier enfant
            const { data: measurements } = await supabase
              .from('growth_measurements')
              .select('*')
              .eq('child_id', profiles[0].id)
              .order('measurement_date', { ascending: true });
              
            if (measurements && measurements.length > 0) {
              const formattedData = measurements.map(item => ({
                name: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
                taille: Number(item.height_cm),
                poids: Number(item.weight_kg),
                eveil: item.head_cm ? Number(item.head_cm) : undefined,
              }));
              setGrowthData(formattedData);
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
        } finally {
          setLoading(false);
        }
      }
      
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen overflow-hidden">
      <NavBar />
      <HeroSection />
      
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { 
              duration: 0.3,
              staggerChildren: 0.1
            } 
          },
        }}
      >
        <LazyLoadedSections 
          demoGrowthData={user && growthData.length > 0 ? growthData : demoGrowthData}
          isLoading={loading}
          isAuthenticated={!!user}
          childProfileId={childProfiles[0]?.id}
        />
      </motion.div>
    </div>
  );
};

export default Index;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export interface Milestone {
  id: string;
  name: string;
  age: string;
  achieved: boolean;
}

export interface MilestonesListProps {
  milestones?: Milestone[];
  childId?: string;
}

const MilestonesList: React.FC<MilestonesListProps> = ({ milestones: propMilestones, childId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (propMilestones && propMilestones.length > 0) {
      setMilestones(propMilestones);
      return;
    }
    
    if (childId) {
      const fetchMilestones = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('milestones')
            .select('*')
            .eq('child_id', childId);
            
          if (error) throw error;
          
          const transformedMilestones = data.map(item => ({
            id: item.id,
            name: item.name,
            age: item.expected_age_months ? `${item.expected_age_months} mois` : 'N/A',
            achieved: !!item.achieved_date
          }));
          
          setMilestones(transformedMilestones);
        } catch (error) {
          console.error('Error fetching milestones:', error);
          setMilestones([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMilestones();
    } else {
      setMilestones([]);
    }
  }, [propMilestones, childId]);
  
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4 ml-7">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-200"></div>
            <div className="w-full">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucune étape clé enregistrée.</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="absolute h-full w-1 bg-babybaby-blue/30 left-3 top-0 rounded-full"></div>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <motion.div 
            key={milestone.id || index}
            className="flex items-start gap-4 ml-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`absolute left-2 w-2.5 h-2.5 rounded-full ${milestone.achieved ? 'bg-green-400' : 'bg-gray-300'}`}></div>
            <div>
              <p className="font-medium">{milestone.name}</p>
              <p className="text-sm text-gray-600">{milestone.age}</p>
            </div>
            {milestone.achieved && (
              <div className="flex-1 text-right">
                <span className="text-green-500 text-xs">✓ Acquis</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MilestonesList;

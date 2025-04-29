import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Milestone {
  id: string;
  title: string;
  age_range: string;
  category: string;
  completed: boolean;
}

interface MilestonesListProps {
  childId: string;
}

// Données demo des jalons pour quand l'id est 'demo'
const demoMilestones: Milestone[] = [
  {
    id: 'demo-milestone-1',
    title: 'Tient sa tête',
    age_range: '0-3 mois',
    category: 'Motricité',
    completed: true
  },
  {
    id: 'demo-milestone-2',
    title: 'Sourire en réponse',
    age_range: '0-3 mois',
    category: 'Social',
    completed: true
  },
  {
    id: 'demo-milestone-3',
    title: 'S\'assoit sans support',
    age_range: '4-7 mois',
    category: 'Motricité',
    completed: false
  },
  {
    id: 'demo-milestone-4',
    title: 'Dit son premier mot',
    age_range: '8-12 mois',
    category: 'Langage',
    completed: false
  }
];

const MilestonesList: React.FC<MilestonesListProps> = ({ childId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (childId === 'demo') {
      setMilestones(demoMilestones);
      setLoading(false);
      return;
    }
    
    const fetchMilestones = async () => {
      try {
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .eq('child_id', childId);

        if (error) throw error;
        setMilestones(data || []);
      } catch (error) {
        console.error("Error fetching milestones:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les jalons de développement",
          variant: "destructive",
        });
        setMilestones(demoMilestones); // Fallback to demo data on error
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [childId, toast]);

  const toggleCategory = (category: string) => {
    setActiveCategory(prevCategory => (prevCategory === category ? null : category));
  };

  const toggleMilestone = async (id: string, completed: boolean) => {
    if (childId === 'demo') {
      // In demo mode, just update the local state
      setMilestones(prevMilestones =>
        prevMilestones.map(milestone =>
          milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone
        )
      );
      toast({
        title: "Mode démonstration",
        description: "Les jalons sont mis à jour localement en mode démo."
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('milestones')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;

      setMilestones(prevMilestones =>
        prevMilestones.map(milestone =>
          milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone
        )
      );

      toast({
        title: "Jalon mis à jour",
        description: "Le jalon a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le jalon.",
        variant: "destructive",
      });
    }
  };

  const filteredMilestones = activeCategory
    ? milestones.filter(milestone => milestone.category === activeCategory)
    : milestones;

  const categories = [...new Set(milestones.map(milestone => milestone.category))];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Jalons du développement</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-babybaby-cosmic"></div>
          </div>
        ) : (
          <div>
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Button>
              ))}
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => toggleCategory(null)}
              >
                Tous
              </Button>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredMilestones.map(milestone => (
                <motion.li
                  key={milestone.id}
                  className="py-4 flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h3 className="text-sm font-semibold">{milestone.title}</h3>
                    <p className="text-gray-500 text-xs">{milestone.age_range}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleMilestone(milestone.id, milestone.completed)}
                  >
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MilestonesList;

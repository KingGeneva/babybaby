
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Check, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the Milestone type that matches the backend schema
export interface Milestone {
  id: string;
  child_id: string;
  name: string;
  expected_age_months: number | null;
  achieved_date: string | null;
  notes: string | null;
  created_at: string;
  // For UI purposes
  title?: string;
  age_range?: string;
  category?: string;
  completed?: boolean;
}

interface MilestonesListProps {
  childId: string;
  birthDate: string;
}

const MilestonesList: React.FC<MilestonesListProps> = ({ childId, birthDate }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    expected_age_months: '',
    achieved_date: '',
    notes: '',
  });

  // Fetch milestones for the child
  useEffect(() => {
    const fetchMilestones = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .eq('child_id', childId)
          .order('expected_age_months', { ascending: true });

        if (error) throw error;

        if (data) {
          // Transform data to match Milestone type with UI properties
          const transformedData = data.map(milestone => ({
            ...milestone,
            title: milestone.name,
            category: 'Development',  // Default category
            age_range: milestone.expected_age_months ? `${milestone.expected_age_months} mois` : 'Non défini',
            completed: !!milestone.achieved_date
          }));
          
          setMilestones(transformedData);
        }
      } catch (error) {
        console.error('Error fetching milestones:', error);
        toast.error('Impossible de charger les étapes de développement');
      } finally {
        setIsLoading(false);
      }
    };

    if (childId) {
      fetchMilestones();
    }
  }, [childId]);

  // Handle adding a new milestone
  const handleAddMilestone = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert([
          {
            child_id: childId,
            name: newMilestone.name,
            expected_age_months: newMilestone.expected_age_months ? parseInt(newMilestone.expected_age_months) : null,
            achieved_date: newMilestone.achieved_date || null,
            notes: newMilestone.notes || null,
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const addedMilestone = {
          ...data[0],
          title: data[0].name,
          category: 'Development',
          age_range: data[0].expected_age_months ? `${data[0].expected_age_months} mois` : 'Non défini',
          completed: !!data[0].achieved_date
        };
        
        setMilestones([...milestones, addedMilestone]);
        setIsAddDialogOpen(false);
        setNewMilestone({
          name: '',
          expected_age_months: '',
          achieved_date: '',
          notes: '',
        });
        toast.success('Nouvelle étape de développement ajoutée');
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error('Impossible d\'ajouter l\'étape de développement');
    }
  };

  // Handle updating a milestone's completion status
  const handleToggleCompletion = async (milestone: Milestone) => {
    const updatedMilestone = { ...milestone };
    
    if (!updatedMilestone.achieved_date) {
      updatedMilestone.achieved_date = new Date().toISOString().split('T')[0];
    } else {
      updatedMilestone.achieved_date = null;
    }
    
    try {
      const { error } = await supabase
        .from('milestones')
        .update({ achieved_date: updatedMilestone.achieved_date })
        .eq('id', milestone.id);

      if (error) throw error;

      const updatedMilestones = milestones.map(m => 
        m.id === milestone.id ? { 
          ...m, 
          achieved_date: updatedMilestone.achieved_date,
          completed: !!updatedMilestone.achieved_date 
        } : m
      );
      
      setMilestones(updatedMilestones);
      
      if (updatedMilestone.achieved_date) {
        toast.success(`${milestone.name} marqué comme accompli`);
      } else {
        toast.info(`${milestone.name} marqué comme non accompli`);
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast.error('Impossible de mettre à jour l\'étape de développement');
    }
  };

  // Handle input changes for new milestone
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMilestone({
      ...newMilestone,
      [name]: value,
    });
  };

  // Handle date change for new milestone
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewMilestone({
        ...newMilestone,
        achieved_date: date.toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Étapes de développement</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une étape de développement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'étape</Label>
                <Input
                  id="name"
                  name="name"
                  value={newMilestone.name}
                  onChange={handleInputChange}
                  placeholder="Premier sourire, Premier mot..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_age_months">Âge attendu (mois)</Label>
                <Input
                  id="expected_age_months"
                  name="expected_age_months"
                  type="number"
                  min="0"
                  value={newMilestone.expected_age_months}
                  onChange={handleInputChange}
                  placeholder="6"
                />
              </div>
              <div className="space-y-2">
                <Label>Date d'accomplissement (optionnel)</Label>
                <DatePicker
                  selectedDate={newMilestone.achieved_date ? parseISO(newMilestone.achieved_date) : undefined}
                  onDateChange={handleDateChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newMilestone.notes}
                  onChange={handleInputChange}
                  placeholder="Contexte, observations..."
                  className="h-20"
                />
              </div>
              <Button className="w-full" onClick={handleAddMilestone}>
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Chargement des étapes de développement...</p>
        </div>
      ) : milestones.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune étape de développement enregistrée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className={milestone.achieved_date ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{milestone.name}</h3>
                    {milestone.expected_age_months && (
                      <p className="text-sm text-gray-500 mb-2">
                        Attendu autour de {milestone.expected_age_months} mois
                      </p>
                    )}
                    {milestone.notes && <p className="text-sm mt-2">{milestone.notes}</p>}
                    {milestone.achieved_date && (
                      <p className="text-sm text-green-600 mt-2">
                        <Check className="inline-block h-4 w-4 mr-1" />
                        Accompli le {format(parseISO(milestone.achieved_date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    )}
                  </div>
                  <Button
                    variant={milestone.achieved_date ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleCompletion(milestone)}
                    className={milestone.achieved_date ? "text-green-600" : ""}
                  >
                    {milestone.achieved_date ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Accompli
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-1" /> Marquer
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestonesList;

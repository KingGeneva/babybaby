
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentForm from '@/components/medical/AppointmentForm';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { MedicalAppointment } from '@/types/medical';
import P5Canvas from '@/components/P5Canvas';

export default function MedicalAppointmentPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const initialDate = searchParams.get('date');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<MedicalAppointment | undefined>(undefined);
  const [childName, setChildName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const isEditing = !!id;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (!childId) {
      navigate('/parental-dashboard');
      return;
    }
  }, [user, loading, navigate, childId]);

  useEffect(() => {
    const fetchChildName = async () => {
      if (!childId) return;
      
      try {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('name')
          .eq('id', childId)
          .single();
          
        if (error) throw error;
        setChildName(data.name);
      } catch (error) {
        console.error('Error fetching child name:', error);
      }
    };
    
    fetchChildName();
  }, [childId]);

  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
      try {
        const { data, error } = await supabase
          .from('medical_appointments')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data.child_id !== childId) {
          toast({
            title: 'Erreur',
            description: 'Ce rendez-vous n\'appartient pas à cet enfant',
            variant: 'destructive',
          });
          navigate(`/medical/dashboard/${childId}`);
          return;
        }
        
        setAppointment({
          id: data.id,
          title: data.title,
          date: data.date,
          time: data.time || undefined,
          doctor: data.doctor,
          location: data.location || undefined,
          notes: data.notes || undefined,
          completed: data.completed,
          type: data.type,
          childId: data.child_id,
        });
      } catch (error) {
        console.error('Error fetching appointment:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données du rendez-vous',
          variant: 'destructive',
        });
        navigate(`/medical/dashboard/${childId}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [id, childId, navigate]);

  const handleSubmit = async (data: Omit<MedicalAppointment, 'id'>) => {
    if (!childId) return;
    
    try {
      if (isEditing && id) {
        // Update existing appointment
        const { error } = await supabase
          .from('medical_appointments')
          .update({
            title: data.title,
            date: data.date,
            time: data.time || null,
            doctor: data.doctor,
            location: data.location || null,
            notes: data.notes || null,
            completed: data.completed,
            type: data.type,
          })
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new appointment
        const { error } = await supabase
          .from('medical_appointments')
          .insert({
            title: data.title,
            date: data.date,
            time: data.time || null,
            doctor: data.doctor,
            location: data.location || null,
            notes: data.notes || null,
            completed: data.completed,
            type: data.type,
            child_id: childId,
          });
          
        if (error) throw error;
      }
      
      toast({
        title: isEditing ? 'Rendez-vous mis à jour' : 'Rendez-vous créé',
        description: isEditing 
          ? 'Le rendez-vous a été mis à jour avec succès' 
          : 'Le rendez-vous a été créé avec succès',
      });
      
      navigate(`/medical/dashboard/${childId}`);
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur s\'est produite lors de l\'enregistrement du rendez-vous',
        variant: 'destructive',
      });
    }
  };

  if (loading || (isLoading && isEditing)) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(`/medical/dashboard/${childId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="text-babybaby-cosmic">
              {isEditing ? 'Modifier' : 'Ajouter'} un rendez-vous
            </span>
            {childName ? ` - ${childName}` : ''}
          </h1>
        </div>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isEditing ? 'Modifier les détails' : 'Nouveau rendez-vous médical'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(childId && !isLoading) && (
              <AppointmentForm 
                initialData={appointment}
                childId={childId}
                initialDate={initialDate || undefined}
                onSubmit={handleSubmit}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}

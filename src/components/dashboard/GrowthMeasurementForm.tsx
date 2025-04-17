
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface MeasurementFormValues {
  measurementDate: string;
  heightCm: number;
  weightKg: number;
  headCm?: number;
  notes?: string;
}

const GrowthMeasurementForm: React.FC<{ 
  childId: string;
  onSuccess?: () => void;
}> = ({ childId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<MeasurementFormValues>({
    defaultValues: {
      measurementDate: new Date().toISOString().split('T')[0],
      heightCm: 0,
      weightKg: 0,
    },
  });

  const onSubmit = async (data: MeasurementFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('growth_measurements')
        .insert({
          child_id: childId,
          measurement_date: data.measurementDate,
          height_cm: data.heightCm,
          weight_kg: data.weightKg,
          head_cm: data.headCm,
          notes: data.notes,
        });

      if (error) throw error;
      
      toast({
        title: "Mesure enregistrée",
        description: `Les données de croissance ont été enregistrées.`,
      });
      
      form.reset({
        measurementDate: new Date().toISOString().split('T')[0],
        heightCm: 0,
        weightKg: 0,
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer les mesures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ajouter une mesure de croissance</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="measurementDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de la mesure</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="heightCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poids (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="headCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour de tête (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field} 
                        onChange={e => e.target.value ? field.onChange(parseFloat(e.target.value)) : field.onChange(undefined)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Notes supplémentaires (optionnel)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les mesures"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GrowthMeasurementForm;

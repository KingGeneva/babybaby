
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { saveSleepLog } from './sleepTrackerStorage';

// Define the form schema with validation
const sleepLogSchema = z.object({
  date: z.string().nonempty({ message: "La date est requise" }),
  startTime: z.string().nonempty({ message: "L'heure de début est requise" }),
  endTime: z.string().nonempty({ message: "L'heure de fin est requise" }),
  quality: z.string().nonempty({ message: "La qualité est requise" }),
  notes: z.string().optional(),
});

type SleepLogFormValues = z.infer<typeof sleepLogSchema>;

const SleepLogForm = () => {
  const form = useForm<SleepLogFormValues>({
    resolver: zodResolver(sleepLogSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '',
      endTime: '',
      quality: 'good',
      notes: '',
    },
  });
  
  const onSubmit = (values: SleepLogFormValues) => {
    // Calculate duration in minutes
    const startDateTime = new Date(`${values.date}T${values.startTime}`);
    const endDateTime = new Date(`${values.date}T${values.endTime}`);
    
    // Adjust for sleep past midnight
    let durationMs = endDateTime.getTime() - startDateTime.getTime();
    if (durationMs < 0) {
      // If end time is less than start time, assume it's the next day
      durationMs += 24 * 60 * 60 * 1000;
    }
    
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    // Format duration for display
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const durationDisplay = `${hours}h${minutes < 10 ? '0' + minutes : minutes}`;
    
    // Save the log with duration calculated
    const sleepLog = {
      ...values,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      durationMinutes,
      durationDisplay,
    };
    
    saveSleepLog(sleepLog);
    
    toast({
      title: "Sommeil enregistré",
      description: `Durée: ${durationDisplay}`,
    });
    
    // Reset form fields except date
    form.reset({
      ...form.getValues(),
      startTime: '',
      endTime: '',
      notes: '',
    });
  };
  
  // Quality options for the sleep
  const qualityOptions = [
    { label: "Bon", value: "good" },
    { label: "Moyen", value: "medium" },
    { label: "Mauvais", value: "poor" },
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="date" {...field} />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de début</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualité du sommeil</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                {qualityOptions.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={field.value === option.value ? "default" : "outline"}
                    className={field.value === option.value ? "bg-babybaby-cosmic" : ""}
                    onClick={() => form.setValue("quality", option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notez vos observations ici... (réveils nocturnes, difficultés d'endormissement, etc.)" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Ajoutez des détails qui pourraient être utiles pour analyser les habitudes de sommeil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
          Enregistrer cette période de sommeil
        </Button>
      </form>
    </Form>
  );
};

export default SleepLogForm;

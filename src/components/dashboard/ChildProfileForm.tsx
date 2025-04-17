
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

interface ProfileFormValues {
  name: string;
  birthDate: string;
  gender: string;
}

const ChildProfileForm: React.FC<{ onSuccess?: (childId: string) => void }> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: '',
      birthDate: '',
      gender: 'fille',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: childData, error } = await supabase
        .from('child_profiles')
        .insert({
          user_id: user.id,
          name: data.name,
          birth_date: data.birthDate,
          gender: data.gender,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Profil créé",
        description: `Le profil de ${data.name} a été créé avec succès.`,
      });
      
      form.reset();
      if (onSuccess && childData) onSuccess(childData.id);
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Créer le profil de votre enfant</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'enfant</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom de votre enfant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de naissance</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fille" id="fille" />
                        <FormLabel htmlFor="fille">Fille</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="garçon" id="garçon" />
                        <FormLabel htmlFor="garçon">Garçon</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le profil"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChildProfileForm;

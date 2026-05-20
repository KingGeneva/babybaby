import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Check, X, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Measurement {
  id: string;
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_cm: number | null;
  notes: string | null;
}

interface Props {
  measurements: Measurement[];
  onChange: () => void;
}

const GrowthHistoryTable: React.FC<Props> = ({ measurements, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Measurement>>({});

  const startEdit = (m: Measurement) => {
    setEditingId(m.id);
    setDraft({ ...m });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from('growth_measurements')
      .update({
        measurement_date: draft.measurement_date,
        height_cm: draft.height_cm ?? null,
        weight_kg: draft.weight_kg ?? null,
        head_cm: draft.head_cm ?? null,
        notes: draft.notes ?? null,
      })
      .eq('id', editingId);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Mesure mise à jour' });
    cancelEdit();
    onChange();
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette mesure ?')) return;
    const { error } = await supabase.from('growth_measurements').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Mesure supprimée' });
    onChange();
  };

  const exportCSV = () => {
    const headers = ['date', 'taille_cm', 'poids_kg', 'tour_tete_cm', 'notes'];
    const rows = measurements.map(m => [
      m.measurement_date,
      m.height_cm ?? '',
      m.weight_kg ?? '',
      m.head_cm ?? '',
      (m.notes ?? '').replace(/[\n,]/g, ' '),
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesures-croissance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Historique des mesures</CardTitle>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={!measurements.length}>
          <Download className="h-3.5 w-3.5 mr-1" /> CSV
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {measurements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucune mesure enregistrée.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>T. tête</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[110px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...measurements]
                .sort((a, b) => +new Date(b.measurement_date) - +new Date(a.measurement_date))
                .map((m) => {
                const editing = editingId === m.id;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      {editing ? (
                        <Input type="date" value={draft.measurement_date as string}
                          onChange={(e) => setDraft(d => ({ ...d, measurement_date: e.target.value }))}
                          className="h-8 w-36" />
                      ) : new Date(m.measurement_date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {editing ? (
                        <Input type="number" step="0.1" value={draft.height_cm ?? ''}
                          onChange={(e) => setDraft(d => ({ ...d, height_cm: e.target.value ? parseFloat(e.target.value) : null }))}
                          className="h-8 w-20" />
                      ) : m.height_cm ? `${m.height_cm} cm` : '—'}
                    </TableCell>
                    <TableCell>
                      {editing ? (
                        <Input type="number" step="0.01" value={draft.weight_kg ?? ''}
                          onChange={(e) => setDraft(d => ({ ...d, weight_kg: e.target.value ? parseFloat(e.target.value) : null }))}
                          className="h-8 w-20" />
                      ) : m.weight_kg ? `${m.weight_kg} kg` : '—'}
                    </TableCell>
                    <TableCell>
                      {editing ? (
                        <Input type="number" step="0.1" value={draft.head_cm ?? ''}
                          onChange={(e) => setDraft(d => ({ ...d, head_cm: e.target.value ? parseFloat(e.target.value) : null }))}
                          className="h-8 w-20" />
                      ) : m.head_cm ? `${m.head_cm} cm` : '—'}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {editing ? (
                        <Input value={(draft.notes as string) ?? ''}
                          onChange={(e) => setDraft(d => ({ ...d, notes: e.target.value }))}
                          className="h-8" />
                      ) : (m.notes || '—')}
                    </TableCell>
                    <TableCell>
                      {editing ? (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveEdit}><Check className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEdit}><X className="h-3.5 w-3.5" /></Button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default GrowthHistoryTable;

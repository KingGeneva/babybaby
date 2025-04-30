
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { SleepLog, getSleepLogs, deleteSleepLog } from './sleepTrackerStorage';
import { Clock, Trash2 } from 'lucide-react';

const SleepHistoryView: React.FC = () => {
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [searchDate, setSearchDate] = useState<string>('');
  
  // Load sleep logs from storage
  useEffect(() => {
    const logs = getSleepLogs();
    setSleepLogs(logs);
  }, []);
  
  // Handle log deletion
  const handleDelete = (id: string) => {
    deleteSleepLog(id);
    setSleepLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    toast({
      title: "Enregistrement supprimé",
      description: "La période de sommeil a été supprimée avec succès."
    });
  };
  
  // Filter logs based on search date
  const filteredLogs = searchDate 
    ? sleepLogs.filter(log => log.date === searchDate)
    : sleepLogs;
  
  // Group logs by date
  const logsByDate = filteredLogs.reduce((groups, log) => {
    if (!groups[log.date]) {
      groups[log.date] = [];
    }
    groups[log.date].push(log);
    return groups;
  }, {} as Record<string, SleepLog[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(logsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr });
  };
  
  // Get quality color class
  const getQualityColorClass = (quality: string) => {
    switch (quality) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get quality label
  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'good': return 'Bon';
      case 'medium': return 'Moyen';
      case 'poor': return 'Mauvais';
      default: return quality;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="md:w-64"
        />
        <Button 
          variant="outline" 
          onClick={() => setSearchDate('')}
          className="whitespace-nowrap"
        >
          Afficher tout
        </Button>
      </div>
      
      {sleepLogs.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-xl font-medium text-slate-700">Aucun enregistrement</h3>
          <p className="text-slate-500 mt-2">
            Commencez à enregistrer les périodes de sommeil de votre bébé
          </p>
        </div>
      ) : sortedDates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">Aucun enregistrement trouvé pour cette date</p>
        </div>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="space-y-2">
            <h3 className="font-medium text-slate-700 capitalize">
              {formatDisplayDate(date)}
            </h3>
            
            <div className="space-y-2">
              {logsByDate[date].map(log => (
                <Card key={log.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.startTime} - {log.endTime}</span>
                        <span className="text-sm text-slate-500">
                          ({log.durationDisplay})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span 
                          className={`text-xs px-2 py-0.5 rounded-full ${getQualityColorClass(log.quality)}`}
                        >
                          {getQualityLabel(log.quality)}
                        </span>
                        
                        {log.notes && (
                          <span className="text-sm text-slate-600 line-clamp-1">
                            {log.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet enregistrement de sommeil ? 
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(log.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SleepHistoryView;

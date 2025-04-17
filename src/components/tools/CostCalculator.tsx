import React, { useState } from 'react';
import { Calculator, PlusCircle, MinusCircle, Save } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';

interface ExpenseItem {
  id: string;
  name: string;
  cost: number;
  isMonthly: boolean;
}

interface CostCalculatorProps {
  className?: string;
}

const CostCalculator: React.FC<CostCalculatorProps> = ({ className }) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: 'Poussette', cost: 200, isMonthly: false },
    { id: '2', name: 'Lit bébé', cost: 150, isMonthly: false },
    { id: '3', name: 'Couches', cost: 50, isMonthly: true },
    { id: '4', name: 'Lait infantile', cost: 40, isMonthly: true },
  ]);
  const [newExpense, setNewExpense] = useState<ExpenseItem>({ 
    id: '', 
    name: '', 
    cost: 0, 
    isMonthly: false 
  });
  const [months, setMonths] = useState<number>(12);
  
  const handleAddExpense = () => {
    if (!newExpense.name || newExpense.cost <= 0) {
      toast({
        title: "Erreur de saisie",
        description: "Veuillez entrer un nom et un coût valide",
        variant: "destructive"
      });
      return;
    }
    
    const id = Date.now().toString();
    setExpenses([...expenses, { ...newExpense, id }]);
    setNewExpense({ id: '', name: '', cost: 0, isMonthly: false });
    
    toast({
      title: "Dépense ajoutée",
      description: `${newExpense.name} a été ajouté à votre liste`
    });
  };
  
  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  const calculateTotalCost = () => {
    const oneTimeCost = expenses
      .filter(expense => !expense.isMonthly)
      .reduce((sum, expense) => sum + expense.cost, 0);
      
    const monthlyCost = expenses
      .filter(expense => expense.isMonthly)
      .reduce((sum, expense) => sum + expense.cost, 0);
      
    const totalMonthly = monthlyCost * months;
    
    return {
      oneTime: oneTimeCost,
      monthly: monthlyCost,
      total: oneTimeCost + totalMonthly
    };
  };
  
  const costs = calculateTotalCost();
  
  const saveCalculation = () => {
    const calculationData = {
      date: new Date().toLocaleDateString(),
      expenses: expenses,
      months: months,
      totalCost: costs.total
    };
    
    const savedCalculations = JSON.parse(localStorage.getItem('babyCalculations') || '[]');
    savedCalculations.push(calculationData);
    localStorage.setItem('babyCalculations', JSON.stringify(savedCalculations));
    
    toast({
      title: "Calcul sauvegardé",
      description: "Votre calcul a été sauvegardé avec succès"
    });
  };
  
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculateur de coûts pour bébé
        </CardTitle>
        <CardDescription>
          Estimez les dépenses liées à l'arrivée de votre bébé (en dollars canadiens)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Ajouter une dépense</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expense-name">Élément</Label>
              <Input
                id="expense-name"
                placeholder="Ex: Poussette, Couches..."
                value={newExpense.name}
                onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="expense-cost">Coût (€)</Label>
              <Input
                id="expense-cost"
                type="number"
                min="0"
                value={newExpense.cost || ''}
                onChange={(e) => setNewExpense({...newExpense, cost: Number(e.target.value)})}
              />
            </div>
            <div className="flex items-center space-x-2 pt-7">
              <input 
                type="checkbox"
                id="is-monthly"
                checked={newExpense.isMonthly}
                onChange={(e) => setNewExpense({...newExpense, isMonthly: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is-monthly">Dépense mensuelle</Label>
            </div>
          </div>
          <Button onClick={handleAddExpense} className="w-full mt-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Liste des dépenses</h3>
          {expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élément</TableHead>
                  <TableHead>Coût (CAD)</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.name}</TableCell>
                    <TableCell>{formatPrice(expense.cost)}</TableCell>
                    <TableCell>{expense.isMonthly ? 'Mensuel' : 'Unique'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveExpense(expense.id)}
                      >
                        <MinusCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">Aucune dépense ajoutée</p>
          )}
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Période de calcul</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Nombre de mois: {months}</Label>
              <span>{months} mois</span>
            </div>
            <Slider 
              value={[months]} 
              min={1} 
              max={36} 
              step={1}
              onValueChange={(values) => setMonths(values[0])}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Dépenses uniques:</span>
            <span>{formatPrice(costs.oneTime)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Dépenses mensuelles:</span>
            <span>{formatPrice(costs.monthly)} / mois</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total sur {months} mois:</span>
            <span className="text-lg font-bold text-babybaby-cosmic">{formatPrice(costs.total)}</span>
          </div>
          
          <Button onClick={saveCalculation} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder ce calcul
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostCalculator;

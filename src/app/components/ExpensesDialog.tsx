'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { Expense } from '@/types/expense';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
interface ExpensesDialogProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  newExpense: Omit<Expense, 'id' | 'selected'>;
  setNewExpense: (expense: Omit<Expense, 'id' | 'selected'>) => void;
  handleAddExpense: () => void;
}
export default function ExpensesDialog({
  isAddDialogOpen,
  setIsAddDialogOpen,
  newExpense,
  setNewExpense,
  handleAddExpense,
}: ExpensesDialogProps) {
  // TODO: Probably should use a custom hook for this or move it to be server side (RSC)
  const {
    data: catFact,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['catFact'],
    queryFn: () => fetch('https://catfact.ninja/fact?max_length=100').then((res) => res.json()),
  });

  useEffect(() => {
    refetch();
  }, [isAddDialogOpen, refetch]);

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 text-white hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-700">
            Add New Expense
          </DialogTitle>
          <DialogDescription>Add a new expense to the list</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="item" className="text-base font-medium">
                Item:
              </Label>
              <Input
                id="item"
                value={newExpense.item}
                onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })}
                placeholder="Item Name"
                className="h-12"
                required
                data-testid="item-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-base font-medium">
                Category:
              </Label>
              <Select
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                value={newExpense.category}
                required
              >
                <SelectTrigger className="h-12" data-testid="category-select">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food" data-testid="food-select-item">
                    Food
                  </SelectItem>
                  <SelectItem value="Furniture" data-testid="furniture-select-item">
                    Furniture
                  </SelectItem>
                  <SelectItem value="Accessory" data-testid="accessory-select-item">
                    Accessory
                  </SelectItem>
                  <SelectItem value="Toy" data-testid="toy-select-item">
                    Toy
                  </SelectItem>
                  <SelectItem value="Healthcare" data-testid="healthcare-select-item">
                    Healthcare
                  </SelectItem>
                  <SelectItem value="Other" data-testid="other-select-item">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-base font-medium">
                Amount:
              </Label>
              <Input
                id="amount"
                type="number"
                value={newExpense.amount || ''}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: Number.parseFloat(e.target.value) || 0 })
                }
                placeholder="Item amount"
                className="h-12"
                required
                data-testid="amount-input"
              />
            </div>
            <Button
              onClick={handleAddExpense}
              className="mt-4 h-12 w-full bg-purple-600 text-base hover:bg-purple-700"
              disabled={!newExpense.item || !newExpense.category || !newExpense.amount}
            >
              Submit
            </Button>
          </div>
          <div className="flex flex-col justify-center rounded-lg bg-purple-50 p-4">
            <h3 className="mb-3 text-xl font-semibold text-purple-600">Random cat fact:</h3>
            <p className="text-lg leading-relaxed text-purple-600">
              {isLoading ? 'Loading...' : catFact.fact}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

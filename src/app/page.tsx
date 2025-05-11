"use client"

import { useState } from "react"
import { Trash2, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Expense } from "@/types/expense"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ExpensesDialog from "./components/ExpensesDialog"
import ExpensesTable from "./components/ExpensesTable"

const queryClient = new QueryClient()


export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", item: "Whiskers Cat food", category: "Food", amount: 10, selected: false },
    { id: "2", item: "Self cleaning cat Litter box", category: "Furniture", amount: 500, selected: false },
    { id: "3", item: "Diamond Cat collar", category: "Accessory", amount: 1000, selected: false },
  ])

  const [newExpense, setNewExpense] = useState<Omit<Expense, "id" | "selected">>({
    item: "",
    category: "",
    amount: 0,
  })

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleCheckboxChange = (id: string) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, selected: !expense.selected } : expense)))
  }

  const handleAddExpense = () => {
    if (newExpense.item && newExpense.category && newExpense.amount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        ...newExpense,
        selected: false,
      }
      setExpenses([...expenses, expense])
      setNewExpense({ item: "", category: "", amount: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteExpenses = () => {
    setExpenses(expenses.filter((expense) => !expense.selected))
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const highestAmount = Math.max(...expenses.map((expense) => expense.amount), 0)
  const isHighestExpense = (amount: number) => amount === highestAmount && highestAmount > 0

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 md:p-8">
        <Card className="max-w-4xl mx-auto shadow-lg border-none">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2 text-2xl md:text-3xl">
                <PawPrint className="h-8 w-8" />
                Cat Expense Tracker
              </CardTitle>
              <p className="text-white font-medium">Total: ${totalAmount}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <ExpensesDialog isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} newExpense={newExpense} setNewExpense={setNewExpense} handleAddExpense={handleAddExpense} />

              <Button
                variant="destructive"
                onClick={handleDeleteExpenses}
                disabled={!expenses.some((expense) => expense.selected)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Expense
              </Button>
            </div>

            <ExpensesTable expenses={expenses} isHighestExpense={isHighestExpense} handleCheckboxChange={handleCheckboxChange} />
          </CardContent>
        </Card>
      </div>
    </QueryClientProvider>
  )
}


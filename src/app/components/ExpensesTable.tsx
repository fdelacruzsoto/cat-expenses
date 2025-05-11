import { Expense } from "@/types/expense";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategoryColor } from "@/lib/category";

interface ExpensesTableProps {
  expenses: Expense[];
  isHighestExpense: (amount: number) => boolean;
  handleCheckboxChange: (id: string) => void;
}

export default function ExpensesTable({ expenses, isHighestExpense, handleCheckboxChange }: ExpensesTableProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-12 p-3"></th>
            <th className="text-left p-3 font-medium">Item</th>
            <th className="text-left p-3 font-medium">Category</th>
            <th className="text-left p-3 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr
              key={expense.id}
              className={`
                      border-t border-gray-200
                      ${isHighestExpense(expense.amount)
                  ? "bg-amber-50 border-l-4 border-l-amber-400"
                  : expense.selected
                    ? "bg-purple-100"
                    : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                }
                      transition-colors duration-150
                      hover:bg-purple-50
                    `}
            >
              <td className="p-3 text-center">
                <Checkbox checked={expense.selected} onCheckedChange={() => handleCheckboxChange(expense.id)} />
              </td>
              <td className="p-3">{expense.item}</td>
              <td className="p-3">
                <span
                  className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getCategoryColor(expense.category)}
                      `}
                >
                  {expense.category}
                </span>
              </td>
              <td className={`p-3 font-medium ${isHighestExpense(expense.amount) ? "text-amber-700" : ""}`}>
                ${expense.amount}
                {isHighestExpense(expense.amount) && (
                  <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                    Highest
                  </span>
                )}
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                No expenses yet. Add your first cat expense!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
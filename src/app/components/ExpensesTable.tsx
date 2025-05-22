import { Expense } from '@/types/expense';
import { Checkbox } from '@/components/ui/checkbox';
import { getCategoryColor } from '@/lib/category';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  RowData,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import React from 'react';
import { Filter } from './Filter';
interface ExpensesTableProps {
  expenses: Expense[];
  isHighestExpense: (amount: number) => boolean;
  isHighestCategory: (category: string) => boolean;
  handleCheckboxChange: (id: string) => void;
}

const columnHelper = createColumnHelper<Expense>();

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select';
  }
}

export default function ExpensesTable({
  expenses,
  isHighestExpense,
  isHighestCategory,
  handleCheckboxChange,
}: ExpensesTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor('selected', {
      header: '',
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <Checkbox
            checked={expense.selected}
            onCheckedChange={() => handleCheckboxChange(expense.id)}
          />
        );
      },
      enableColumnFilter: false,
    }),
    columnHelper.accessor('item', {
      header: 'Item',
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(category)}`}
          >
            {category}
          </span>
        );
      },
      meta: {
        filterVariant: 'select',
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.original.amount;
        return (
          <span className={`font-medium ${isHighestExpense(amount) ? 'text-amber-700' : ''}`}>
            ${amount}{' '}
            {isHighestExpense(amount) && (
              <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 text-xs text-amber-800">
                Highest
              </span>
            )}
          </span>
        );
      },
      meta: {
        filterVariant: 'range',
      },
    }),
  ];

  const table = useReactTable({
    data: expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    filterFns: {},
    state: {
      columnFilters,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan} className="align-top">
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div className="mx-2">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`border-t border-gray-200 ${
                isHighestCategory(row.original.category)
                  ? 'border-l-4 border-l-amber-400 bg-amber-50'
                  : row.original.selected
                    ? 'bg-purple-100'
                    : row.index % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50'
              } transition-colors duration-150 hover:bg-purple-50`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
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
  );
}

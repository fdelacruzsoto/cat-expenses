import { render, screen } from '@testing-library/react';
import ExpensesTable from './ExpensesTable';
import { Expense } from '@/types/expense';

describe('ExpensesTable component', () => {
  const mockExpenses: Expense[] = [
    {
      id: '1',
      item: 'Dog Food',
      amount: 25.99,
      category: 'Food',
      selected: false,
    },
    {
      id: '2',
      item: 'Cat Toy',
      amount: 12.99,
      category: 'Toy',
      selected: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the table with expenses data', () => {
    render(
      <ExpensesTable
        expenses={mockExpenses}
        isHighestExpense={() => false}
        handleCheckboxChange={() => {}}
      />,
    );

    expect(screen.getByText('Dog Food')).toBeInTheDocument();
    expect(screen.getByText('Cat Toy')).toBeInTheDocument();
    expect(screen.getByText('$25.99')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <ExpensesTable
        expenses={mockExpenses}
        isHighestExpense={() => false}
        handleCheckboxChange={() => {}}
      />,
    );

    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders filters for each column', () => {
    render(
      <ExpensesTable
        expenses={mockExpenses}
        isHighestExpense={() => false}
        handleCheckboxChange={() => {}}
      />,
    );

    const filterInputs = screen.getAllByPlaceholderText('Search...');
    expect(filterInputs.length).toBeGreaterThan(0);
  });

  it('renders empty state when no expenses provided', () => {
    render(
      <ExpensesTable
        expenses={[]}
        isHighestExpense={() => false}
        handleCheckboxChange={() => {}}
      />,
    );
    expect(screen.getByText('No expenses yet. Add your first cat expense!')).toBeInTheDocument();
  });
});

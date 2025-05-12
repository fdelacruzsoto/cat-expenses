import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExpensesDialog from './ExpensesDialog';

describe('ExpensesDialog component', () => {
  const queryClient = new QueryClient();

  const mockProps = {
    isAddDialogOpen: true,
    setIsAddDialogOpen: jest.fn(),
    newExpense: {
      item: '',
      category: '',
      amount: 0,
    },
    setNewExpense: jest.fn(),
    handleAddExpense: jest.fn(),
  };

  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ fact: 'Mock cat fact' }),
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the dialog with correct title when open', () => {
    renderWithQueryClient(<ExpensesDialog {...mockProps} />);
    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderWithQueryClient(<ExpensesDialog {...mockProps} />);
    expect(screen.getByLabelText('Item:')).toBeInTheDocument();
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount:')).toBeInTheDocument();
  });

  it('updates item value when input changes', () => {
    renderWithQueryClient(<ExpensesDialog {...mockProps} />);
    const itemInput = screen.getByLabelText('Item:');
    fireEvent.change(itemInput, { target: { value: 'Cat Food' } });
    expect(mockProps.setNewExpense).toHaveBeenCalledWith({
      ...mockProps.newExpense,
      item: 'Cat Food',
    });
  });

  it('updates amount value when input changes', () => {
    renderWithQueryClient(<ExpensesDialog {...mockProps} />);
    const amountInput = screen.getByLabelText('Amount:');
    fireEvent.change(amountInput, { target: { value: '25.99' } });
    expect(mockProps.setNewExpense).toHaveBeenCalledWith({
      ...mockProps.newExpense,
      amount: 25.99,
    });
  });

  it('disables submit button when form is incomplete', () => {
    renderWithQueryClient(<ExpensesDialog {...mockProps} />);
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is complete', () => {
    renderWithQueryClient(
      <ExpensesDialog
        {...mockProps}
        newExpense={{
          item: 'Cat Food',
          category: 'Food',
          amount: 25.99,
        }}
      />,
    );
    const submitButton = screen.getByText('Submit');
    expect(submitButton).not.toBeDisabled();
  });

  it('calls handleAddExpense when submit button is clicked', () => {
    renderWithQueryClient(
      <ExpensesDialog
        {...mockProps}
        newExpense={{
          item: 'Cat Food',
          category: 'Food',
          amount: 25.99,
        }}
      />,
    );
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    expect(mockProps.handleAddExpense).toHaveBeenCalled();
  });

  it('displays cat fact when loaded', () => {
    renderWithQueryClient(<ExpensesDialog {...mockProps} />);
    expect(screen.getByText('Mock cat fact')).toBeInTheDocument();
  });
});

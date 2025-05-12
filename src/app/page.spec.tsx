import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Page from './page'
import userEvent from '@testing-library/user-event'

describe('Page component', () => {
  const queryClient = new QueryClient()

  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the page title', () => {
    renderWithQueryClient(<Page />)
    expect(screen.getByText('Cat Expense Tracker')).toBeInTheDocument()
  })

  it('renders the expenses dialog and delete button', () => {
    renderWithQueryClient(<Page />)
    expect(screen.getByText('Add Expense')).toBeInTheDocument()
    expect(screen.getByText('Delete Expense')).toBeInTheDocument()
  })

  it('shows total amount of expenses', () => {
    renderWithQueryClient(<Page />)
    expect(screen.getByText('Total: $1510')).toBeInTheDocument()
  })

  it('adds a new expense when form is submitted', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<Page />)

    // Open dialog
    await user.click(screen.getByText('Add Expense'))

    // Fill form
    await user.type(screen.getByTestId('item-input'), 'New Food')
    await user.type(screen.getByTestId('amount-input'), '25.99')

    // Select category
    const trigger = screen.getByTestId('category-select');
    await user.pointer({ keys: '[MouseLeft]', target: trigger });

    // Select the 'Food' option
    const foodOption = await screen.findByTestId('food-select-item');
    await user.click(foodOption);

    // Submit form
    await user.click(screen.getByText('Submit'))

    // Wait for the dialog to close and the expense to be added
    await screen.findByText(/New Food/i)
    expect(screen.getByText(/New Food/i)).toBeInTheDocument()
  })

  it('deletes selected expenses', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<Page />)

    // Select the expense
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])

    // Delete selected expense
    await user.click(screen.getByText('Delete Expense'))

    // Verify expense is deleted
    expect(screen.queryByText('Whiskers Cat food')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $1500')).toBeInTheDocument()
  })

  it('highlights highest expense', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<Page />)

    // Add first expense
    await user.click(screen.getByText('Add Expense'))

    // Fill form
    await user.type(screen.getByTestId('item-input'), 'New Food')
    await user.type(screen.getByTestId('amount-input'), '2000')

    // Select category
    const trigger = screen.getByTestId('category-select');
    await user.pointer({ keys: '[MouseLeft]', target: trigger });

    // Select the 'Food' option
    const foodOption = await screen.findByTestId('food-select-item');
    await user.click(foodOption);

    // Submit form
    await user.click(screen.getByText('Submit'))

    // Verify higher amount has highlight class
    const highestAmountCell = screen.getByText('$2000')
    expect(highestAmountCell.closest('span')).toHaveClass('text-amber-700')
  })

})

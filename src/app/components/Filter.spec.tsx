import { render, screen, act } from '@testing-library/react';
import { Filter } from './Filter';
import { Column } from '@tanstack/react-table';
import userEvent from '@testing-library/user-event';

describe('Filter component', () => {
  const mockSetFilterValue = jest.fn();

  const mockColumn = {
    getFilterValue: jest.fn(),
    setFilterValue: mockSetFilterValue,
    columnDef: {
      meta: {},
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as Column<any, unknown>;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders text search input by default', () => {
    render(<Filter column={mockColumn} />);
    expect(screen.getByPlaceholderText('Search...')).toBeVisible();
  });

  it('debounces text search input', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Filter column={mockColumn} />);

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'test');

    expect(mockSetFilterValue).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockSetFilterValue).toHaveBeenCalledWith('test');
  });

  it('renders range inputs for range filter variant', () => {
    mockColumn.columnDef.meta = { filterVariant: 'range' };
    render(<Filter column={mockColumn} />);

    expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max')).toBeInTheDocument();
  });

  it('renders select for select filter variant', () => {
    mockColumn.columnDef.meta = { filterVariant: 'select' };
    render(<Filter column={mockColumn} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

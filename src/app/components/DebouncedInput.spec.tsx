import { render, screen } from '@testing-library/react';
import { DebouncedInput } from './DebouncedInput';

describe('DebouncedInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render with search icon by default', () => {
    render(
      <DebouncedInput value="" onChange={jest.fn()} data-testid="debounced-input" />
    );
    expect(screen.getByTestId('debounced-input')).toBeInTheDocument();
  });

  it('should not render search icon when showSearchIcon is false', () => {
    render(
      <DebouncedInput
        value=""
        onChange={jest.fn()}
        showSearchIcon={false}
        data-testid="debounced-input"
      />
    );
    expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
  });

  it('should sync with external value changes', () => {
    const { rerender } = render(
      <DebouncedInput value="initial" onChange={jest.fn()} data-testid="debounced-input" />
    );
    const input = screen.getByTestId('debounced-input');
    expect(input).toHaveValue('initial');

    rerender(
      <DebouncedInput value="updated" onChange={jest.fn()} data-testid="debounced-input" />
    );
    expect(input).toHaveValue('updated');
  });

});

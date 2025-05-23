import { render, screen } from '@testing-library/react';
import { DebouncedInput } from './DebouncedInput';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
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

  it('should sync with external value changes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <DebouncedInput value="initial" onChange={jest.fn()} data-testid="debounced-input" />
    );
    const input = screen.getByTestId('debounced-input');
    expect(input).toHaveValue('initial');

    await user.clear(input);
    await user.type(input, 'updated');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(input).toHaveValue('updated');
  });

});

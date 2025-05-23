import React, { useCallback, useState } from 'react';
import { DebouncedInput } from './DebouncedInput';
import { Column } from '@tanstack/react-table';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Filter = React.memo(function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const [selectKey, setSelectKey] = useState<number>(Date.now());

  const handleTextChange = useCallback(
    (value: string | number) => {
      if (column.getFilterValue() !== value) {
        column.setFilterValue(value);
      }
    },
    [column]
  );

  const handleMinChange = useCallback(
    (value: string | number) =>
      column.setFilterValue((old: [number, number]) => [value, old?.[1]]),
    [column]
  );

  const handleMaxChange = useCallback(
    (value: string | number) =>
      column.setFilterValue((old: [number, number]) => [old?.[0], value]),
    [column]
  );

  return filterVariant === 'range' ? (
    <div className="flex space-x-2">
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={handleMinChange}
        placeholder="Min"
        className="w-24"
        showSearchIcon={false}
      />
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={handleMaxChange}
        placeholder="Max"
        className="w-24"
        showSearchIcon={false}
      />
    </div>
  ) : filterVariant === 'select' ? (
    <div>
      <Select
        key={selectKey}
        value={columnFilterValue?.toString()}
        onValueChange={column.setFilterValue}
      >
        <SelectTrigger className="h-10 bg-white text-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Food">Food</SelectItem>
          <SelectItem value="Furniture">Furniture</SelectItem>
          <SelectItem value="Accessory">Accessory</SelectItem>
          <SelectItem value="Toy">Toy</SelectItem>
          <SelectItem value="Healthcare">Healthcare</SelectItem>
        </SelectContent>
      </Select>
      {columnFilterValue?.toString() && (
        <Button
          className="mt-2"
          variant="ghost"
          onClick={() => {
            column.setFilterValue('');
            setSelectKey(Date.now());
          }}
        >
          Clear selection
        </Button>
      )}
    </div>
  ) : (
    <DebouncedInput
      value={(columnFilterValue ?? '') as string}
      onChange={handleTextChange}
      placeholder="Search..."
    />
  );
});

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Column } from "@tanstack/react-table"
import { Search } from "lucide-react"
import React, { useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}

  // Little hack to force the select to reset when the filter is cleared
  const [selectKey, setSelectKey] = useState<number>(Date.now())

  return filterVariant === 'range' ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
          showSearchIcon={false}
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
          showSearchIcon={false}
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === 'select' ? (
    <div>
      <Select key={selectKey} value={columnFilterValue?.toString()} onValueChange={column.setFilterValue}>
        <SelectTrigger className="h-10 text-sm bg-white">
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
      {columnFilterValue?.toString() && <Button
        className="mt-2"
        variant="ghost"
        onClick={() => {
          column.setFilterValue("")
          setSelectKey(Date.now())
        }}
      >
        Clear selection
      </Button>}
    </div>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={value => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
    // See faceted column filters example for datalist search suggestions
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  showSearchIcon = true,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number,
  showSearchIcon?: boolean,
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="relative">
      {showSearchIcon && <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />}
      <Input
        {...props} value={value} onChange={e => setValue(e.target.value)}
        className="pl-9 h-10 text-sm bg-white"
      />
    </div>
  )
}
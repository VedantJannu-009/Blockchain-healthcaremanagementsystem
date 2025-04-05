import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface ColumnFilterProps<TData> {
  table: Table<TData>;
  columnId: string;
  placeholder?: string;
  className?: string;
}

const DataTableColumnFilter = <TData,>({
  table,
  columnId,
  placeholder = "Search...",
  className = "max-w-sm",
}: ColumnFilterProps<TData>) => {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(columnId)?.setFilterValue(event.target.value)
      }
      className={className}
    />
  );
};

export default DataTableColumnFilter;

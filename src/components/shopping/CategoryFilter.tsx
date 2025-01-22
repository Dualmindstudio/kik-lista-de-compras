import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  categories: string[];
  filterCategory: string;
  onFilterChange: (value: string) => void;
}

export function CategoryFilter({ categories, filterCategory, onFilterChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <Filter className="h-5 w-5 text-gray-500" />
      <Select value={filterCategory} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  filterCategory: string;
  onFilterChange: (value: string) => void;
  variant?: "desktop" | "mobile";
}

export function CategoryFilter({ 
  categories, 
  filterCategory, 
  onFilterChange,
  variant = "desktop" 
}: CategoryFilterProps) {
  if (variant === "mobile") {
    return (
      <div className="flex gap-2 items-center">
        <Button
          variant={filterCategory === "all" ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap text-sm rounded-full"
          onClick={() => onFilterChange("all")}
        >
          Todos
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap text-sm rounded-full"
            onClick={() => onFilterChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    );
  }

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
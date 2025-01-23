import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  filterCategory: string;
  onFilterChange: (value: string) => void;
  onAddCategory: (category: string) => void;
  onEditCategory: (oldCategory: string, newCategory: string) => void;
  variant?: "desktop" | "mobile";
}

export function CategoryFilter({ 
  categories, 
  filterCategory, 
  onFilterChange,
  onAddCategory,
  onEditCategory,
  variant = "desktop" 
}: CategoryFilterProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
      setIsAdding(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && editValue.trim()) {
      onEditCategory(editingCategory, editValue.trim());
      setEditingCategory(null);
      setEditValue("");
    }
  };

  if (variant === "mobile") {
    return (
      <div className="flex gap-2 items-center">
        <Button
          variant={filterCategory === "all" ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap text-sm rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          onClick={() => onFilterChange("all")}
        >
          Todos
        </Button>
        {categories.map((category) => (
          <div key={category} className="relative group">
            {editingCategory === category ? (
              <form onSubmit={handleEditSubmit} className="flex items-center gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 w-24 text-sm"
                  autoFocus
                />
                <Button type="submit" size="sm" variant="ghost">
                  ✓
                </Button>
              </form>
            ) : (
              <Button
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "whitespace-nowrap text-sm rounded-full",
                  filterCategory === category 
                    ? "bg-blue-50 text-blue-600" 
                    : "hover:bg-blue-50 hover:text-blue-600"
                )}
                onClick={() => onFilterChange(category)}
                onDoubleClick={() => {
                  setEditingCategory(category);
                  setEditValue(category);
                }}
              >
                {category}
              </Button>
            )}
          </div>
        ))}
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="flex items-center gap-1">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-8 w-24 text-sm"
              placeholder="Nova categoria"
              autoFocus
            />
            <Button type="submit" size="sm" variant="ghost">
              ✓
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap text-sm rounded-full"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        )}
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
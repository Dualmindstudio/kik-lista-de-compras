import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShoppingItemProps {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ShoppingItem({
  id,
  name,
  quantity,
  category,
  completed,
  onToggle,
  onRemove,
}: ShoppingItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-fade-in",
        completed ? "bg-gray-50" : "bg-white"
      )}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggle(id)}
          className={cn(
            "rounded-full transition-colors",
            completed && "bg-green-100 text-green-600 hover:bg-green-200"
          )}
        >
          <Check className="h-4 w-4" />
        </Button>
        <div className={cn("transition-opacity", completed && "opacity-50")}>
          <p className={cn("font-medium", completed && "line-through")}>
            {name}
          </p>
          <p className="text-sm text-gray-500">
            {quantity} × {category}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
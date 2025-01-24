import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShoppingItemProps {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  emoji?: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit?: () => void;
}

export function ShoppingItem({
  id,
  name,
  quantity,
  category,
  completed,
  emoji,
  onToggle,
  onRemove,
  onEdit,
}: ShoppingItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-fade-in cursor-pointer",
        completed ? "bg-green-50 border-green-100" : "bg-white hover:border-blue-200"
      )}
      onClick={(e) => {
        // Prevent click when clicking buttons
        if ((e.target as HTMLElement).closest('button')) return;
        onEdit?.();
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggle(id)}
          className={cn(
            "rounded-full transition-colors",
            completed 
              ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700" 
              : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          )}
        >
          <Check className="h-4 w-4" />
        </Button>
        <div className={cn("transition-opacity", completed && "opacity-50")}>
          <p className={cn("font-medium flex items-center gap-2", completed && "line-through")}>
            {emoji && <span className="text-lg">{emoji}</span>}
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
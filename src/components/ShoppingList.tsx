import React, { useState } from "react";
import { Plus, Check, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
}

const categories = [
  "Fruits",
  "Vegetables",
  "Meat",
  "Dairy",
  "Pantry",
  "Beverages",
  "Other",
];

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemCategory, setNewItemCategory] = useState("Other");
  const [filterCategory, setFilterCategory] = useState("all");

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity,
      category: newItemCategory,
      completed: false,
    };
    
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQuantity(1);
    toast.success("Item added to list");
  };

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item removed from list");
  };

  const filteredItems = filterCategory === "all" 
    ? items 
    : items.filter(item => item.category === filterCategory);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <form onSubmit={addItem} className="flex flex-wrap gap-4">
        <Input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item..."
          className="flex-1 min-w-[200px]"
        />
        <Input
          type="number"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(Number(e.target.value))}
          min="1"
          className="w-24"
        />
        <Select value={newItemCategory} onValueChange={setNewItemCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="gap-2">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </form>

      <div className="flex items-center gap-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-fade-in",
              item.completed ? "bg-gray-50" : "bg-white"
            )}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "rounded-full transition-colors",
                  item.completed && "bg-green-100 text-green-600 hover:bg-green-200"
                )}
              >
                <Check className="h-4 w-4" />
              </Button>
              <div className={cn("transition-opacity", item.completed && "opacity-50")}>
                <p className={cn("font-medium", item.completed && "line-through")}>
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.category}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No items in your shopping list
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
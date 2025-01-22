import React, { useState } from "react";
import { toast } from "sonner";
import { CategoryFilter } from "./shopping/CategoryFilter";
import { ShoppingItem } from "./shopping/ShoppingItem";
import { AddItemDialog } from "./shopping/AddItemDialog";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
}

const categories = [
  "Frutas",
  "Legumes",
  "Carnes",
  "Laticínios",
  "Mercearia",
  "Bebidas",
  "Outros",
];

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");

  const handleAddItem = (name: string, quantity: number, category: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      quantity,
      category,
      completed: false,
    };
    
    setItems([...items, newItem]);
    toast.success("Item adicionado à lista");
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
    toast.success("Item removido da lista");
  };

  const filteredItems = filterCategory === "all" 
    ? items 
    : items.filter(item => item.category === filterCategory);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AddItemDialog categories={categories} onAddItem={handleAddItem} />
        <CategoryFilter
          categories={categories}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
        />
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <ShoppingItem
            key={item.id}
            {...item}
            onToggle={toggleItem}
            onRemove={removeItem}
          />
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum item na sua lista de compras
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
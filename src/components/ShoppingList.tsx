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
  emoji?: string;
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

  const handleAddItem = (name: string, quantity: number, category: string, emoji?: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      quantity,
      category,
      completed: false,
      emoji,
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

  const pendingItems = filteredItems.filter(item => !item.completed);
  const completedItems = filteredItems.filter(item => item.completed);

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

      <div className="space-y-8">
        {/* Pending Items */}
        <div className="space-y-4">
          {pendingItems.map((item) => (
            <ShoppingItem
              key={item.id}
              {...item}
              onToggle={toggleItem}
              onRemove={removeItem}
            />
          ))}
          {pendingItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum item pendente na sua lista de compras
            </div>
          )}
        </div>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-gray-200" />
              <h3 className="text-lg font-medium text-gray-500">Itens comprados</h3>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            {completedItems.map((item) => (
              <ShoppingItem
                key={item.id}
                {...item}
                onToggle={toggleItem}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
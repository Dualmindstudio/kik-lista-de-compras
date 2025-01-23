import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { CategoryFilter } from "./shopping/CategoryFilter";
import { ShoppingItem } from "./shopping/ShoppingItem";
import { AddItemDialog } from "./shopping/AddItemDialog";
import { Button } from "./ui/button";

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
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const savedItems = localStorage.getItem("shopping-items");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 space-y-4 sm:space-y-8 animate-fade-in relative min-h-screen">
      {/* Header com filtros - visível apenas em desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AddItemDialog 
          categories={categories} 
          onAddItem={handleAddItem}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
        <CategoryFilter
          categories={categories}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          variant="desktop"
        />
      </div>

      {/* Header mobile - Tags de filtro */}
      <div className="flex sm:hidden overflow-x-auto pb-2 -mx-2 px-2">
        <CategoryFilter
          categories={categories}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          variant="mobile"
        />
      </div>

      <div className="space-y-4 sm:space-y-8">
        {/* Pending Items */}
        <div className="space-y-2 sm:space-y-4">
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
          <div className="space-y-2 sm:space-y-4">
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

      {/* Botão flutuante para mobile */}
      <div className="fixed bottom-6 right-4 sm:hidden">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ShoppingList;
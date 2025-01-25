import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CategoryFilter } from "./shopping/CategoryFilter";
import { AddItemDialog } from "./shopping/AddItemDialog";
import { EditItemDialog } from "./shopping/EditItemDialog";
import { Button } from "./ui/button";
import { SplashScreen } from "./shopping/SplashScreen";
import { ItemsList } from "./shopping/ItemsList";
import { useShoppingItems, type ShoppingItem } from "@/hooks/useShoppingItems";

const ShoppingList = () => {
  const { items, isLoading, addItem, editItem, toggleItem, removeItem } = useShoppingItems();
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem("shopping-categories");
    return savedCategories ? JSON.parse(savedCategories) : [
      "Frutas",
      "Legumes",
      "Carnes",
      "Laticínios",
      "Mercearia",
      "Bebidas",
      "Outros",
    ];
  });

  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  useEffect(() => {
    localStorage.setItem("shopping-categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddCategory = (newCategory: string) => {
    if (categories.includes(newCategory)) {
      toast.error("Esta categoria já existe!");
      return;
    }
    setCategories([...categories, newCategory]);
    toast.success("Categoria adicionada com sucesso!");
  };

  const handleEditCategory = (oldCategory: string, newCategory: string) => {
    if (categories.includes(newCategory)) {
      toast.error("Esta categoria já existe!");
      return;
    }
    setCategories(categories.map(cat => cat === oldCategory ? newCategory : cat));
    toast.success("Categoria editada com sucesso!");
  };

  const filteredItems = filterCategory === "all" 
    ? items 
    : items.filter(item => item.category === filterCategory);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-1 space-y-4 sm:space-y-8 animate-fade-in relative min-h-screen">
      {/* Header com filtros - visível apenas em desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
        <AddItemDialog 
          categories={categories} 
          onAddItem={addItem}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
        <CategoryFilter
          categories={categories}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          variant="desktop"
        />
      </div>

      {/* Header mobile - Tags de filtro */}
      <div className="flex sm:hidden overflow-x-auto no-scrollbar">
        <CategoryFilter
          categories={categories}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          variant="mobile"
        />
      </div>

      <ItemsList 
        items={filteredItems}
        onToggle={toggleItem}
        onRemove={removeItem}
        onEdit={setEditingItem}
      />

      {/* Edit Dialog */}
      {editingItem && (
        <EditItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          categories={categories}
          onEdit={editItem}
        />
      )}

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
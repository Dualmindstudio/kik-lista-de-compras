import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CategoryFilter } from "./shopping/CategoryFilter";
import { ShoppingItem } from "./shopping/ShoppingItem";
import { AddItemDialog } from "./shopping/AddItemDialog";
import { EditItemDialog } from "./shopping/EditItemDialog";
import { Button } from "./ui/button";
import { SplashScreen } from "./shopping/SplashScreen";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
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
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        toast.error("Erro ao carregar itens");
        console.error("Error fetching items:", error);
        return;
      }

      setItems(data || []);
    };

    fetchItems();

    // Inscrever-se para atualizações em tempo real
    const subscription = supabase
      .channel('shopping_items_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'shopping_items' 
        }, 
        (payload) => {
          console.log("Realtime update:", payload);
          if (payload.eventType === 'INSERT') {
            setItems(current => [...current, payload.new as ShoppingItem]);
          } else if (payload.eventType === 'DELETE') {
            setItems(current => current.filter(item => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setItems(current => 
              current.map(item => 
                item.id === payload.new.id ? payload.new as ShoppingItem : item
              )
            );
          }
        })
      .subscribe();

    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-categories", JSON.stringify(categories));
  }, [categories]);

  const handleAddItem = async (name: string, quantity: number, category: string) => {
    const newItem = {
      name,
      quantity,
      category,
      completed: false,
      user_id: (await supabase.auth.getUser()).data.user?.id
    };
    
    const { error } = await supabase
      .from('shopping_items')
      .insert([newItem]);

    if (error) {
      toast.error("Erro ao adicionar item");
      console.error("Error adding item:", error);
      return;
    }

    toast.success("Item adicionado à lista");
  };

  const handleEditItem = async (id: string, name: string, category: string) => {
    const { error } = await supabase
      .from('shopping_items')
      .update({ name, category })
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar item");
      console.error("Error updating item:", error);
      return;
    }

    toast.success("Item atualizado com sucesso");
  };

  const toggleItem = async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    const { error } = await supabase
      .from('shopping_items')
      .update({ completed: !item.completed })
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar item");
      console.error("Error toggling item:", error);
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao remover item");
      console.error("Error removing item:", error);
      return;
    }

    toast.success("Item removido da lista");
  };

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
    setItems(items.map(item => 
      item.category === oldCategory 
        ? { ...item, category: newCategory }
        : item
    ));
    toast.success("Categoria editada com sucesso!");
  };

  const filteredItems = filterCategory === "all" 
    ? items 
    : items.filter(item => item.category === filterCategory);

  const pendingItems = filteredItems.filter(item => !item.completed);
  const completedItems = filteredItems.filter(item => item.completed);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-1 space-y-4 sm:space-y-8 animate-fade-in relative min-h-screen">
      {/* Header com filtros - visível apenas em desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
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

      <div className="space-y-4 sm:space-y-8 px-1">
        {/* Pending Items */}
        <div className="space-y-1 sm:space-y-4">
          {pendingItems.map((item) => (
            <ShoppingItem
              key={item.id}
              {...item}
              onToggle={toggleItem}
              onRemove={removeItem}
              onEdit={() => setEditingItem(item)}
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
          <div className="space-y-1 sm:space-y-4">
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
                onEdit={() => setEditingItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <EditItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          categories={categories}
          onEdit={handleEditItem}
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
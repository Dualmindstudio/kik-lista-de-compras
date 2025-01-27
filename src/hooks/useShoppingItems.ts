import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  emoji?: string;
}

export const useShoppingItems = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching items from Supabase...");
        
        const { data, error } = await supabase
          .from('shopping_items')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          toast.error("Erro ao carregar itens: " + error.message);
          return;
        }

        console.log("Items fetched successfully:", data);
        setItems(data || []);
      } catch (err) {
        console.error("Error in fetchItems:", err);
        toast.error("Erro ao carregar itens. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();

    const subscription = supabase
      .channel('shopping_items_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'shopping_items' 
        }, 
        (payload) => {
          console.log("Realtime update received:", payload);
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addItem = async (name: string, quantity: number, category: string, emoji?: string) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .insert([{ 
          name, 
          quantity, 
          category, 
          completed: false,
          emoji
        }]);

      if (error) throw error;
      toast.success("Item adicionado à lista");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Erro ao adicionar item");
    }
  };

  const editItem = async (id: string, name: string, category: string, emoji?: string) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({ name, category, emoji })
        .eq('id', id);

      if (error) throw error;
      toast.success("Item atualizado com sucesso");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Erro ao atualizar item");
    }
  };

  const toggleItem = async (id: string) => {
    try {
      const item = items.find(item => item.id === id);
      if (!item) return;

      const { error } = await supabase
        .from('shopping_items')
        .update({ completed: !item.completed })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Error toggling item:", error);
      toast.error("Erro ao atualizar item");
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Item removido da lista");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Erro ao remover item");
    }
  };

  return {
    items,
    isLoading,
    addItem,
    editItem,
    toggleItem,
    removeItem
  };
};
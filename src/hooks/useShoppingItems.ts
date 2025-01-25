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
        setIsLoading(true);
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

    const initializeSupabase = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Supabase session:", session ? "Active" : "No session");
        
        if (!session) {
          const { error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Anonymous auth error:", error);
            toast.error("Erro ao inicializar sessão");
            return;
          }
        }
        
        await fetchItems();
      } catch (err) {
        console.error("Initialization error:", err);
        toast.error("Erro ao inicializar aplicação");
      }
    };

    initializeSupabase();

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

  const addItem = async (name: string, quantity: number, category: string) => {
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

  const editItem = async (id: string, name: string, category: string) => {
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

  return {
    items,
    isLoading,
    addItem,
    editItem,
    toggleItem,
    removeItem
  };
};
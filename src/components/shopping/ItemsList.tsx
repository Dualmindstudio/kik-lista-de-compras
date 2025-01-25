import { ShoppingItem } from "@/components/shopping/ShoppingItem";
import { type ShoppingItem as ShoppingItemType } from "@/hooks/useShoppingItems";

interface ItemsListProps {
  items: ShoppingItemType[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (item: ShoppingItemType) => void;
}

export const ItemsList = ({ items, onToggle, onRemove, onEdit }: ItemsListProps) => {
  const pendingItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  return (
    <div className="space-y-4 sm:space-y-8 px-1">
      {/* Pending Items */}
      <div className="space-y-1 sm:space-y-4">
        {pendingItems.map((item) => (
          <ShoppingItem
            key={item.id}
            {...item}
            onToggle={onToggle}
            onRemove={onRemove}
            onEdit={() => onEdit(item)}
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
              onToggle={onToggle}
              onRemove={onRemove}
              onEdit={() => onEdit(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
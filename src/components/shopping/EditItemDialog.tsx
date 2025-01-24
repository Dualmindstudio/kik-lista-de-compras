import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
    category: string;
    emoji?: string;
  };
  categories: string[];
  onEdit: (id: string, name: string, category: string, emoji?: string) => void;
}

export function EditItemDialog({ 
  open, 
  onOpenChange, 
  item, 
  categories,
  onEdit 
}: EditItemDialogProps) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [emoji, setEmoji] = useState(item.emoji || "");

  useEffect(() => {
    if (open) {
      setName(item.name);
      setCategory(item.category);
      setEmoji(item.emoji || "");
    }
  }, [open, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(item.id, name.trim(), category, emoji.trim() || undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Input
                placeholder="😋"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full text-center"
                maxLength={2}
              />
            </div>
            <div className="col-span-3">
              <Input
                placeholder="Nome do item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
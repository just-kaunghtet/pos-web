import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddItemDialog = ({ open, onOpenChange }: AddItemDialogProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !count) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('items')
        .insert([
          { 
            name, 
            price: parseFloat(price), 
            count: parseInt(count, 10)
          }
        ]);

      if (error) throw error;
      
      // Clear form and show success message
      setName("");
      setPrice("");
      setCount("");
      onOpenChange(false);
      toast.success("Item added successfully");
      
      // Refresh the items list
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error("Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-white"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Inventory count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="bg-white"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
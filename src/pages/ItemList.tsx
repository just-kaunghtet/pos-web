import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddItemDialog from "@/components/AddItemDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Item {
  id: string;
  // Add other properties if needed
}

const ItemList = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();
  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleItemClick = (item: Item) => {
    navigate(`/item-info/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-pos-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to={`/home/${username}`}>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-pos-text">Item List</h1>
        </div>

        <Card className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead className="w-[30%]">Price (kyats)</TableHead>
                <TableHead className="w-[30%]">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No items found</TableCell>
                </TableRow>
              ) : (
                items?.map((item) => (
                  <TableRow key={item.id} onClick={() => handleItemClick(item)}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Button className="w-full" size="lg" onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Item
        </Button>

        <AddItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </div>
    </div>
  );
};

export default ItemList;
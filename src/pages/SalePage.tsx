import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useParams,Link, useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string; // Ensure this matches your data type (string)
  name: string;
  price: number;
  count: number; // This can be used if needed
}

interface OrderItem {
  id: string; // Change to string to match MenuItem id type
  name: string;
  price: number;
  quantity: number;
}

const SalePage: React.FC = () => {
  const username =useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*');

      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        setMenuItems(data);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddItem = (item: MenuItem) => {
    setOrderItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id);
      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id: string) => { // Change to string to match OrderItem id type
    setOrderItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.00; // 8% tax
  const total = subtotal + tax;

  const printOrderCard = () => {
    navigate('/receipt', { state: { scannedItems: orderItems } });
  };

  return (
    <div className="min-h-screen bg-pos-background p-6">
      
      <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link to={`/home/`}>
           <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
           <h1 className="text-3xl font-bold text-pos-text">New Sale</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card
            key={item.id}
            className="p-4 cursor-pointer hover:bg-secondary transition-colors h-fit"
            onClick={() => handleAddItem(item)}
          >
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-muted-foreground">{item.price} kyats</p>
          </Card>
        ))}
      </div>
      <Card className="p-4 mt-4" id="order-card">
        <h2 className="text-xl font-semibold mb-4">Current Order</h2>
        <div className="space-y-2 mb-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{item.name} x </span>
                {item.quantity}
              </div>
              <div className="flex items-center gap-2">
                <span>{(item.price * item.quantity)} kyats</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{subtotal} kyats</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (0%)</span>
            <span>{tax} kyats</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{total} kyats</span>
          </div>
        </div>
        <Button className="w-full mt-4" onClick={printOrderCard}>Check Out</Button>
      </Card>
      </div>     
    </div>
    </div>
  );
};

export default SalePage;
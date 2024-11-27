import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import 'svg2pdf.js';

const ItemInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPrice, setNewPrice] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [printSize, setPrintSize] = useState('A4');
  const [numQRCodes, setNumQRCodes] = useState(12);
  
  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching item:", error);
      } else {
        setItem(data);
      }
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const updatePrice = async () => {
    if (newPrice === null) return;
    const { error } = await supabase
      .from('items')
      .update({ price: newPrice })
      .eq('id', id);

    if (error) {
      console.error("Error updating price:", error);
    } else {
      setItem((prevItem) => ({ ...prevItem, price: newPrice }));
    }
  };
  const updateCount = async () => {
    if (newCount === null) return;
    const { error } = await supabase
      .from('items')
      .update({ count: newCount })
      .eq('id', id);

    if (error) {
      console.error("Error updating count:", error);
    } else {
      setItem((prevItem) => ({ ...prevItem, count: newCount }));
    }
  };

  const deleteItem = async () => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting item:", error);
    } else {
      navigate('/manage-items'); // Redirect to the item list page after deletion
    }
  };

  const handlePrint = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: printSize.toLowerCase(),
    });

    const qrSize = 16.5; // 1 inch in millimeters
    const margin = 3; // Margin between QR codes
    const qrPerRow = Math.floor((pdf.internal.pageSize.getWidth() - margin) / (qrSize + margin));
    const qrPerPage = Math.floor((pdf.internal.pageSize.getHeight() - margin) / (qrSize + margin)) * qrPerRow;

    for (let i = 0; i < numQRCodes; i++) {
      if (i > 0 && i % qrPerPage === 0) pdf.addPage();

      const row = Math.floor((i % qrPerPage) / qrPerRow);
      const col = i % qrPerRow;

      const x = margin + col * (qrSize + margin);
      const y = margin + row * (qrSize + margin);

      const qrElement = document.querySelector(`#qr-code-${i} svg`);
      if (qrElement) {
        await pdf.svg(qrElement, { x, y, width: qrSize, height: qrSize });
      }
    }

    pdf.save('qrcodes.pdf');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="min-h-screen bg-pos-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/manage-items">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-pos-text">{item.name}</h1>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex space-x-4">
          <div className="bg-pos-text-light p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-pos-text mb-2">Current Price:</h2>
            <p className="text-2xl font-bold text-pos-background">{item.price} kyats</p>
          </div>
          <div className="bg-pos-text-light p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-pos-text mb-2">Current Inventory:</h2>
            <p className="text-2xl font-bold text-pos-background">{item.count}</p>
          </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-pos-text">Update Price:</h2>
            <div className="flex space-x-4">
            <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="max-w-[200px]"
              />
              <Button onClick={updatePrice}>Update</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-pos-text">Update Count:</h2>
            <div className="flex space-x-4">
            <Input
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(Number(e.target.value))}
                className="max-w-[200px]"
              />
              <Button onClick={updateCount}>Update</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-pos-text">Product QR Code</h2>
            <div className="bg-white p-4 w-fit rounded-lg">
              <QRCodeSVG value={item.id} size={128} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-pos-text">Select Print Size:</h2>
            <div className="flex space-x-4">
              <Button variant={printSize === 'A4' ? "secondary" : "outline"} className="w-20" onClick={() => setPrintSize('A4')}>A4</Button>
              <Button variant={printSize === 'A5' ? "secondary" : "outline"} className="w-20" onClick={() => setPrintSize('A5')}>A5</Button>
              <Button variant={printSize === 'A6' ? "secondary" : "outline"} className="w-20" onClick={() => setPrintSize('A6')}>A6</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-pos-text">Number of QRs to print:</h2>
            <div className="flex space-x-4">
              <Input
                type="number"
                value={numQRCodes}
                onChange={(e) => setNumQRCodes(Number(e.target.value))}
                className="max-w-[200px]"
              />
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print QRs
              </Button>
            </div>
          </div>

          <div className="hidden">
            {Array.from({ length: numQRCodes }).map((_, index) => (
              <div id={`qr-code-${index}`} key={index}>
                <QRCodeSVG value={item.id} size={128} />
              </div>
            ))}
          </div>

          <Button variant="destructive" className="w-full" onClick={deleteItem}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Item
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ItemInfo;
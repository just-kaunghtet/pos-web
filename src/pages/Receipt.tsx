import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Receipt = () => {
  const location = useLocation();
  const scannedItems = location.state?.scannedItems || [];
  const total = scannedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const saveReceiptToSupabase = async () => {
    try {
      const receiptDate = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('receipts')
        .insert([{ date: receiptDate, total }]);

      if (error) {
        console.error("Error inserting receipt:", error.message);
        return;
      }

      console.log("Receipt saved:", data);

      for (const item of scannedItems) {
        await updateItemCounts(item);
      }
    } catch (err) {
      console.error("Unexpected error saving receipt:", err);
    }
  };

  const updateItemCounts = async (item) => {
    try {
      const [{ data: saleData, error: saleError }, { data: inventoryData, error: inventoryError }] = await Promise.all([
        supabase.from('sales').select('sale_count').eq('item_id', item.id).single(),
        supabase.from('items').select('count').eq('id', item.id).single(),
      ]);

      if (saleError || inventoryError) {
        console.error(`Error fetching counts for item ${item.id}:`, saleError?.message || inventoryError?.message);
        return;
      }

      const newSaleCount = (saleData.sale_count || 0) + item.quantity;
      const newInventoryCount = (inventoryData.count || 0) - item.quantity;

      const [updateSaleError, updateInventoryError] = await Promise.all([
        supabase.from('sales').update({ sale_count: newSaleCount }).eq('item_id', item.id),
        supabase.from('items').update({ count: newInventoryCount }).eq('id', item.id),
      ]);

      if (updateSaleError || updateInventoryError) {
        console.error(`Error updating counts for item ${item.id}:`, updateSaleError || updateInventoryError);
      } else {
        console.log(`Updated counts for item ${item.id}`);
      }
    } catch (err) {
      console.error(`Unexpected error updating counts for item ${item.id}:`, err);
    }
  };

  const printReceipt = async () => {
    const receiptElement = document.getElementById('receipt'); // Get the receipt element

    if (receiptElement) {
      const canvas = await html2canvas(receiptElement); // Capture the receipt as canvas
      const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data
      const pdf = new jsPDF(); // Create a new jsPDF instance
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save('receipt.pdf'); // Save the PDF
    } else {
      console.error("Receipt element not found.");
    }
  };

  return (
    <div className="min-h-screen bg-pos-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to={'/home/'}>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-pos-text">Receipt</h1>
        </div>

        <Card className="p-6 max-w-xl text-center" id="receipt">
          <h2 className="text-2xl font-bold text-pos-text mb-8">POS Store</h2>
          <div className="text-left">
            <h1 className="text-xl font-semibold mb-4">Receipt Details</h1>
            {scannedItems.length > 0 ? (
              <ul className="space-y-2 mt-2">
                <li className="grid grid-cols-4 font-bold text-pos-text text-sm">
                  <span>Name</span>
                  <span className="text-center">Count</span>
                  <span className="text-center">Unit Price</span>
                  <span className="text-center">Total</span>
                </li>
                {scannedItems.map((item) => (
                  <li key={item.id} className="grid grid-cols-4 border-b pb-2">
                    <span>{item.name}</span>
                    <span className="text-center">{item.quantity}</span>
                    <span className="text-center">{item.price} kyats</span>
                    <span className="text-center">{item.price * item.quantity} kyats</span>
                  </li>
                ))}
                <li className="grid grid-cols-4 mt-4 font-bold text-pos-text">
                  <span className="col-span-3 text-center">Subtotal:</span>
                  <span className="text-center">{total} kyats</span>
                </li>
              </ul>
            ) : (
              <p className="text-gray-500">No items scanned.</p>
            )}
          </div>

          <div className="flex space-x-4 mt-8">
            <Button className="flex-1 h-16" size="lg" onClick={() => { printReceipt(); saveReceiptToSupabase(); }}>
              <Printer className="mr-2 h-6 w-6" />
              Print Receipt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Receipt;

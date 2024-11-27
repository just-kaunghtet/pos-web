import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, ArrowLeft } from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Receipt = () => {
  const { username } = useParams();
  const location = useLocation();
  const scannedItems = location.state?.scannedItems || [];
  const total = scannedItems.reduce((sum, item) => sum + item.price * item.count, 0);

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

      const newSaleCount = (saleData.sale_count || 0) + item.count;
      const newInventoryCount = (inventoryData.count || 0) - item.count;

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

  const printReceipt = async (size) => {
    const fontSize = size === "small" ? "10px" : "15px";
    const documentWidth = size === "small" ? "300px" : "800px";

    try {
      await saveReceiptToSupabase();

      const printWindow = window.open("", "", "width=800,height=600");
      if (!printWindow) {
        console.error("Failed to open print window.");
        return;
      }

      const receiptHTML = `
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; font-size: ${fontSize}; width: ${documentWidth}; }
              .receipt-header { text-align: center; margin-bottom: 20px; }
              .receipt-header h2 { margin: 0; }
              .receipt-details { width: 100%; border-collapse: collapse; }
              .receipt-details th, .receipt-details td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .receipt-details th { background-color: #f2f2f2; }
              .total { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="receipt-header"><h2>POS Store</h2></div>
            <table class="receipt-details">
              <thead>
                <tr><th>Item Name</th><th>Item Count</th><th>Unit Price</th><th>Total</th></tr>
              </thead>
              <tbody>
                ${scannedItems
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                    <td>${item.price} kyats</td>
                    <td>${item.price * item.count} kyats</td>
                  </tr>`
                  )
                  .join("")}
                <tr class="total">
                  <td colspan="3" style="text-align: right;">Total:</td>
                  <td>${total} kyats</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>`;

      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error printing receipt:", error);
    }
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
          <h1 className="text-3xl font-bold text-pos-text">Receipt</h1>
        </div>

        <Card className="p-6 text-center">
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
                    <span className="text-center">{item.count}</span>
                    <span className="text-center">{item.price} kyats</span>
                    <span className="text-center">{item.price * item.count} kyats</span>
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
            <Button className="flex-1 h-16" size="lg" onClick={() => printReceipt("small")}>
              <Printer className="mr-2 h-6 w-6" />
              Small
            </Button>
            <Button className="flex-1 h-16" size="lg" onClick={() => printReceipt("large")}>
              <Printer className="mr-2 h-6 w-6" />
              Large
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Receipt;

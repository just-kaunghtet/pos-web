// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { QrReader } from "react-qr-reader";
// import { supabase } from "@/integrations/supabase/client";
// import { useParams } from "react-router-dom";
// const QRScanner = () => {
//   const { username } = useParams();
//   const [qrData, setQrData] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [scannedItems, setScannedItems] = useState<Array<{ id: string; name: string; price: number; count: number }>>([]);
//   useEffect(() => {
//     if (qrData) {
//       fetchItemDetails(qrData);
//     }
//   }, [qrData]);

//   const navigate = useNavigate();
//   const handleScan = (data: string) => {
//     if (data && data !== qrData) {
//       setQrData(data);
//     }
//   };
//   const handleCheckout = () => {
//     navigate(`/receipt`, { state: { scannedItems } });
//   };
//   const fetchItemDetails = async (itemId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('items')
//         .select('id, name, price') // Ensure these fields exist in your table
//         .eq('id', itemId)
//         .single();

//       if (error) {
//         console.error("Supabase error:", error);
//         setError(`Error fetching item ${itemId}: ${error.message}`);
//         return;
//       }

//       if (!data) {
//         setError(`Item with ID ${itemId} not found.`);
//         return;
//       }

//       setScannedItems((prevItems) => [...prevItems, { ...data, count: 1 }]);
//       setError(null); // Clear any previous error
//     } catch (err) {
//       console.error("Unexpected error:", err);
//       setError(`Unexpected error fetching item ${itemId}`);
//     }
//   };

//   const updateItemCount = (itemId: string, delta: number) => {
//     setScannedItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === itemId ? { ...item, count: Math.max(0, item.count + delta) } : item
//       )
//     );
//   };

//   return (
//     <div className="min-h-screen bg-pos-background p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center mb-8">
//           <Link to={`/home/${username}`}>
//             <Button variant="ghost" className="mr-4">
//               <ArrowLeft className="w-5 h-5" />
//             </Button>
//           </Link>
//           <h1 className="text-3xl font-bold text-pos-text">QR Scanner</h1>
//         </div>

//         <Card className="flex flex-col p-6 text-center justify-center items-center ">
//           <div className=" mb-8 w-1/2 h-1/2 ">
//             <QrReader
//               onResult={(result, error) => {
//                 if (result) {
//                   handleScan(result.getText());
//                 }
//                 if (error) {
//                   setError("No QR code detected");
//                 }
//               }}
//               constraints={{
//                 facingMode: { ideal: "environment" }
//               }}
//             />
//           </div>

//           {scannedItems.length > 0 && (
//             <div className="mb-4">
//               <p className="text-lg font-semibold">Scanned Items:</p>
//               <div className="bg-pos-primary p-4 rounded-lg">
//                 {scannedItems.map((item) => (
//                   <div key={item.id} className="grid grid-cols-4 text-sm text-white justify-center items-center">
//                     <div className="col-span-2 text-left">{item.name}</div>
//                     <div className="col-span-1">{item.price} kyats</div>
//                     <div className="col-span-1 flex items-center">
//                       <Button variant="ghost" onClick={() => updateItemCount(item.id, -1)}>-</Button>
//                       <span className="mx-2">{item.count}</span>
//                       <Button variant="ghost" onClick={() => updateItemCount(item.id, 1)}>+</Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="mb-4 text-red-500">
//               <p>{error}</p>
//             </div>
//           )}
//           <div className="flex flex-row gap-4">
//             <Button size="lg" className="w-full" onClick={() => setScannedItems([])}>
//               Reset
//             </Button>
//             <Button size="lg" className="w-full" onClick={handleCheckout}>
//               Checkout
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default QRScanner;
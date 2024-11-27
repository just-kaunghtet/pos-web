import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ItemList from "./pages/ItemList";
import ItemInfo from "./pages/ItemInfo";
import QRScanner from "./pages/QRScanner";
import Receipt from "./pages/Receipt";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home/:username" element={<Index />} />
          <Route path="/manage-items/:username" element={<ItemList />} />
          <Route path="/item-info/:id" element={<ItemInfo />} />
          <Route path="/scanner/:username" element={<QRScanner />} />
          <Route path="/receipt/" element={<Receipt />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
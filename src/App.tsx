import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ItemList from "./pages/ItemList";
import ItemInfo from "./pages/ItemInfo";
import Receipt from "./pages/Receipt";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MonthlySale from "./pages/MonthlySale";
import SalePage from './pages/SalePage';

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
          <Route path="/home/" element={<Index />} />
          <Route path="/manage-items/" element={<ItemList />} />
          <Route path="/item-info/:id" element={<ItemInfo />} />
          <Route path="/receipt/" element={<Receipt />} />
          <Route path="/monthly-report/" element={<MonthlySale/>}/>
          <Route path="/new-sale/" element={<SalePage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
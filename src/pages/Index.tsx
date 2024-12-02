import { Card } from "@/components/ui/card";
import { ShoppingCart, BarChart2, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";

const Index = () => {
  const { username } = useParams(); 
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pos-background to-pos-surface p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pos-text">Hello, {username}</h2>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-pos-text mb-2">Welcome to</h1>
        <h2 className="text-5xl font-bold text-pos-text mb-12">POS System</h2>
        <div className="grid grid-cols-2 gap-6">
          <Link to={`/manage-items/`}>
            <Card className="p-6 hover:shadow-xl hover:bg-pos-hover transition-all duration-300 text-pos-text hover:text-pos-surface hover:bg-pos-text">
              <div className="flex flex-col items-center space-y-4">
                <Settings className="w-12 h-12 " />
                <h3 className="text-xl font-semibold ">Manage Items</h3>
              </div>
            </Card>
          </Link>
          
          <Link to={`/new-sale/`}>
            <Card className="p-6 hover:shadow-xl hover:bg-pos-hover transition-all duration-300 text-pos-text hover:text-pos-surface hover:bg-pos-text">
              <div className="flex flex-col items-center space-y-4">
                <ShoppingCart className="w-12 h-12" />
                <h3 className="text-xl font-semibold">New Sale</h3>
              </div>
            </Card>
          </Link>
          
          <Link to={`/monthly-report/`}>
            <Card className="p-6 hover:shadow-xl hover:bg-pos-hover transition-all duration-300 text-pos-text hover:text-pos-surface hover:bg-pos-text">
              <div className="flex flex-col items-center space-y-4">
                <BarChart2 className="w-12 h-12" />
                <h3 className="text-xl font-semibold">Monthly Report</h3>
              </div>
            </Card>
          </Link>
          
          <Link to="/admin-login">
            <Card className="p-6 hover:shadow-xl hover:bg-pos-hover transition-all duration-300 text-pos-text hover:text-pos-surface hover:bg-pos-text">
              <div className="flex flex-col items-center space-y-4">
                <User className="w-12 h-12" />
                <h3 className="text-xl font-semibold">Admin Login</h3>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
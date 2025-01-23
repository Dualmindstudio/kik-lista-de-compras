import { ShoppingCart } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center animate-fade-in">
      <ShoppingCart className="w-20 h-20 text-blue-600 animate-bounce" />
      <h1 className="text-3xl font-bold mt-4 text-blue-600">KIK</h1>
      <p className="text-blue-400 mt-2">Lista de Compras</p>
    </div>
  );
}
import ShoppingList from "@/components/ShoppingList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping List</h1>
        <ShoppingList />
      </div>
    </div>
  );
};

export default Index;
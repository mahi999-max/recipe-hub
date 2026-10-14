export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      
      {/* Cards / Summary Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl shadow-sm bg-card">
          <h2 className="text-muted-foreground text-sm">Total Recipes</h2>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="p-4 border rounded-xl shadow-sm bg-card">
          <h2 className="text-muted-foreground text-sm">Favorites</h2>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="p-4 border rounded-xl shadow-sm bg-card">
          <h2 className="text-muted-foreground text-sm">Purchased Recipes</h2>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Calendar, 
  Apple, 
  Utensils, 
  Coffee, 
  Pizza,
  Fish,
  Egg,
  Beef,
  Carrot
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Datos simulados
const FOOD_DATABASE = [
  { id: "f1", name: "Pollo a la plancha", calories: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein" },
  { id: "f2", name: "Arroz blanco", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "carbs" },
  { id: "f3", name: "Aguacate", calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: "fat" },
  { id: "f4", name: "Batata asada", calories: 90, protein: 2, carbs: 20.7, fat: 0.1, category: "carbs" },
  { id: "f5", name: "Salmón", calories: 208, protein: 20, carbs: 0, fat: 13, category: "protein" },
  { id: "f6", name: "Huevos", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, category: "protein" },
  { id: "f7", name: "Espinacas", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: "vegetable" },
  { id: "f8", name: "Almendras", calories: 576, protein: 21, carbs: 22, fat: 49, category: "fat" },
];

// Datos de plan de comidas
const MEAL_PLAN = {
  monday: [
    { meal: "Desayuno", foods: ["f6", "f8", "f7"] },
    { meal: "Almuerzo", foods: ["f1", "f2", "f7"] },
    { meal: "Cena", foods: ["f5", "f4", "f3"] },
  ],
  tuesday: [
    { meal: "Desayuno", foods: ["f6", "f3"] },
    { meal: "Almuerzo", foods: ["f1", "f4", "f7"] },
    { meal: "Cena", foods: ["f5", "f2", "f7"] },
  ],
  // Otros días de la semana...
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Nutrition = () => {
  const { mode } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [activeMeal, setActiveMeal] = useState("Desayuno");
  
  // Calcular nutrientes para el día seleccionado
  const dayMeals = MEAL_PLAN[selectedDay as keyof typeof MEAL_PLAN] || [];
  
  const dayNutrients = dayMeals.reduce((acc, meal) => {
    const mealNutrients = meal.foods.reduce((mealAcc, foodId) => {
      const food = FOOD_DATABASE.find(f => f.id === foodId);
      if (food) {
        mealAcc.calories += food.calories;
        mealAcc.protein += food.protein;
        mealAcc.carbs += food.carbs;
        mealAcc.fat += food.fat;
      }
      return mealAcc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    acc.calories += mealNutrients.calories;
    acc.protein += mealNutrients.protein;
    acc.carbs += mealNutrients.carbs;
    acc.fat += mealNutrients.fat;
    
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  // Filtrar alimentos por búsqueda
  const filteredFoods = FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Datos para el gráfico de macronutrientes
  const macroData = [
    { name: "Proteínas", value: dayNutrients.protein * 4 }, // 4 calorías por gramo
    { name: "Carbohidratos", value: dayNutrients.carbs * 4 }, // 4 calorías por gramo
    { name: "Grasas", value: dayNutrients.fat * 9 } // 9 calorías por gramo
  ];
  
  // Obtener la comida activa
  const mealFoods = dayMeals.find(meal => meal.meal === activeMeal)?.foods || [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Nutrición</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar alimentos..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Planificación Semanal
            </CardTitle>
            <CardDescription>Plan de comidas para la semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <button 
                  className={`px-3 py-1 rounded-md transition-colors ${selectedDay === "monday" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setSelectedDay("monday")}
                >
                  Lun
                </button>
                <button 
                  className={`px-3 py-1 rounded-md transition-colors ${selectedDay === "tuesday" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setSelectedDay("tuesday")}
                >
                  Mar
                </button>
                <button className="px-3 py-1 rounded-md hover:bg-muted">Mié</button>
                <button className="px-3 py-1 rounded-md hover:bg-muted">Jue</button>
                <button className="px-3 py-1 rounded-md hover:bg-muted">Vie</button>
                <button className="px-3 py-1 rounded-md hover:bg-muted">Sáb</button>
                <button className="px-3 py-1 rounded-md hover:bg-muted">Dom</button>
              </div>

              <div className="space-y-4">
                {dayMeals.map((meal) => (
                  <div 
                    key={meal.meal}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${meal.meal === activeMeal ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                    onClick={() => setActiveMeal(meal.meal)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {meal.meal === "Desayuno" && <Coffee className="h-4 w-4 text-orange-500" />}
                        {meal.meal === "Almuerzo" && <Utensils className="h-4 w-4 text-green-500" />}
                        {meal.meal === "Cena" && <Pizza className="h-4 w-4 text-blue-500" />}
                        <span className="font-medium">{meal.meal}</span>
                      </div>
                      <Badge variant="outline">
                        {meal.foods.reduce((acc, foodId) => {
                          const food = FOOD_DATABASE.find(f => f.id === foodId);
                          return acc + (food?.calories || 0);
                        }, 0)} kcal
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {meal.foods.map(foodId => {
                        const food = FOOD_DATABASE.find(f => f.id === foodId);
                        return food?.name;
                      }).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Generar Plan Semanal</Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="overview">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{activeMeal} - {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="foods">Alimentos</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Detalles nutricionales para {activeMeal.toLowerCase()}
              </CardDescription>
            </CardHeader>

            <TabsContent value="overview">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Calorías: {dayNutrients.calories.toFixed(0)} kcal</span>
                        <span className="text-sm font-medium">80%</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Proteínas: {dayNutrients.protein.toFixed(1)} g</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Carbohidratos: {dayNutrients.carbs.toFixed(1)} g</span>
                        <span className="text-sm font-medium">70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Grasas: {dayNutrients.fat.toFixed(1)} g</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="foods">
              <CardContent>
                <div className="space-y-4">
                  {mealFoods.length > 0 ? (
                    <div className="space-y-3">
                      {mealFoods.map(foodId => {
                        const food = FOOD_DATABASE.find(f => f.id === foodId);
                        if (!food) return null;
                        
                        return (
                          <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full p-2 bg-primary/10">
                                {food.category === "protein" && <Beef className="h-5 w-5 text-red-500" />}
                                {food.category === "carbs" && <Apple className="h-5 w-5 text-amber-500" />}
                                {food.category === "fat" && <Fish className="h-5 w-5 text-blue-500" />}
                                {food.category === "vegetable" && <Carrot className="h-5 w-5 text-green-500" />}
                              </div>
                              <div>
                                <div className="font-medium">{food.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                                </div>
                              </div>
                            </div>
                            <div className="font-medium">{food.calories} kcal</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Utensils className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                      <p className="text-muted-foreground">No hay alimentos en esta comida</p>
                      <Button variant="outline" className="mt-4">Añadir Alimentos</Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Limpiar</Button>
                <Button size="sm">Añadir Alimento</Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Búsqueda</CardTitle>
            <CardDescription>
              {filteredFoods.length} alimentos encontrados para "{searchTerm}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoods.map(food => (
                <div 
                  key={food.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-primary/10">
                      {food.category === "protein" && <Beef className="h-5 w-5 text-red-500" />}
                      {food.category === "carbs" && <Apple className="h-5 w-5 text-amber-500" />}
                      {food.category === "fat" && <Fish className="h-5 w-5 text-blue-500" />}
                      {food.category === "vegetable" && <Carrot className="h-5 w-5 text-green-500" />}
                    </div>
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {food.calories} kcal | {food.protein}g P
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Nutrition;


import { Card } from "@/components/ui/card";
import { Activity, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface OverviewTabContentProps {
  activityData: { name: string; sessions: number }[];
  goalsData: { name: string; value: number }[];
  mode: "trainer" | "client";
}

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#8ab4f8"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const OverviewTabContent = ({ activityData, goalsData, mode }: OverviewTabContentProps) => {
  const isMobile = useIsMobile();
  
  // Enhanced activity data with color mapping
  const enhancedActivityData = activityData.map(item => {
    // Determine intensity based on session count
    // Higher session counts get warmer colors
    let intensity = 'low';
    if (item.sessions >= 3) intensity = 'high';
    else if (item.sessions >= 1) intensity = 'medium';
    
    return {
      ...item,
      intensity
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Actividad Semanal</h3>
          </div>
          <p className="text-sm text-muted-foreground">Distribución de sesiones por día</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enhancedActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }} 
              />
              <Bar dataKey="sessions" barSize={30}>
                {enhancedActivityData.map((entry, index) => {
                  // Color based on intensity
                  let color = '#E5EAFC'; // low
                  if (entry.intensity === 'high') color = '#4285F4';
                  else if (entry.intensity === 'medium') color = '#8ab4f8';
                  
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Distribución de Objetivos</h3>
          </div>
          <p className="text-sm text-muted-foreground">Objetivos de los clientes</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          {goalsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goalsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={!isMobile ? renderCustomizedLabel : undefined}
                  outerRadius={isMobile ? 80 : 110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} clientes`, name]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  layout={isMobile ? "vertical" : "horizontal"}
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground">
              No hay datos de objetivos disponibles
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OverviewTabContent;

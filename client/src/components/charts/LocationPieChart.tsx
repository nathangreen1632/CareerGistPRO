import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RegionData {
  region: string;
  count: number;
}

interface Props {
  data: RegionData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8854d0', '#fa8231'];

export const LocationPieChart = ({ data }: Props) => (
  <div className="w-full h-80 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="location"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }): string =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {data.map((_, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

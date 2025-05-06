import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SalaryTooltip from './SalaryTooltip';

interface SalaryData {
  title: string;
  date: string;
  avgSalary: number;
  company: string;
  applyLink: string;
  location?: string; // Optional in case some entries lack this
}

interface Props {
  data: SalaryData[];
}

export const SalaryLineChart = ({ data }: Props) => (
  <div className="w-full h-80 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="avgSalary"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Tooltip content={<SalaryTooltip />} />
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

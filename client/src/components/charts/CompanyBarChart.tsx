import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CompanyData {
  company: string;
  count: number;
}

interface Props {
  data: CompanyData[];
}

export const CompanyBarChart = ({ data }: Props) => (
  <div className="w-full h-80 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="company" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

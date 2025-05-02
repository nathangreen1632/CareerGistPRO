import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SalaryData {
  title: string;
  date: string;
  avgSalary: number;
  company: string;
  applyLink: string;
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
        <Tooltip
          content={({ payload }) => {
            const data = payload?.[0]?.payload;
            if (!data) return null;

            return (
              <div className="bg-white dark:bg-gray-300 p-3 rounded shadow text-sm space-y-1">
                <p className="font-semibold">{data.title}</p>
                <p className="text-green-600">${data.avgSalary.toFixed(2)}</p>
                <p className="text-black">{data.company}</p>
                <p className="text-black">{data.location}</p>
              </div>
            );
          }}
        />
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

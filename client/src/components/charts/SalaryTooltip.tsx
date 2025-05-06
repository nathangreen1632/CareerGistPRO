import React from 'react';

interface SalaryTooltipProps {
  payload?: {
    payload: {
      title: string;
      avgSalary: number;
      company: string;
      location: string;
    };
  }[];
}

const SalaryTooltip: React.FC<SalaryTooltipProps> = ({ payload }) => {
  const data = payload?.[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-white dark:bg-gray-300 p-3 rounded shadow text-sm space-y-1">
      <p className="font-semibold">{data.title}</p>
      <p className="text-green-600">
        ${Number(data.avgSalary).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      </p>
      <p className="text-black">{data.company}</p>
      <p className="text-black">{data.location}</p>
    </div>
  );
};

export default SalaryTooltip;

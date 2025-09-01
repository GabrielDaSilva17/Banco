import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Transaction, TransactionType, Category } from '../types';
import { Card } from './ui/Card';

interface SpendingChartProps {
  transactions: Transaction[];
}

const COLORS = ['#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe', '#ecfeff'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 rounded-md border border-slate-600">
        <p className="label text-slate-200">{`${label} : $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    const spendingByCategory = transactions
      .filter((tx) => tx.type === TransactionType.DEBIT)
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {} as Record<Category, number>);

    return Object.entries(spendingByCategory)
      .map(([name, amount]) => ({ name: t(`transactions.categories.${name}` as any), amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, t]);

  return (
    <Card>
      <h3 className="text-xl font-bold text-slate-100 mb-4">{t('spendingChart.title')}</h3>
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(100, 116, 139, 0.2)'}} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                 {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            {t('spendingChart.noData')}
          </div>
        )}
      </div>
    </Card>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PieChart as PieChartIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryData {
  name: string;
  value: number;
  count: number;
  type: 'income' | 'expense';
}

interface TransactionChartProps {
  refreshTrigger: number;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];

export const TransactionChart = ({ refreshTrigger }: TransactionChartProps) => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransactionSummary = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('type, amount, category')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate totals
      const income = data?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const expenses = data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      setTotalIncome(income);
      setTotalExpenses(expenses);

      // Group by category for expenses (most relevant for pie chart)
      const expensesByCategory = data?.filter(t => t.type === 'expense').reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += Number(transaction.amount);
        acc[category].count += 1;
        return acc;
      }, {} as Record<string, { total: number; count: number }>) || {};

      const chartData = Object.entries(expensesByCategory).map(([category, data]) => ({
        name: category,
        value: data.total,
        count: data.count,
        type: 'expense' as const
      }));

      setCategoryData(chartData);
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionSummary();
  }, [user, refreshTrigger]);

  const netWorth = totalIncome - totalExpenses;

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">Loading chart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Worth</p>
                <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netWorth.toFixed(2)}
                </p>
              </div>
              <Badge variant={netWorth >= 0 ? 'default' : 'destructive'}>
                {netWorth >= 0 ? 'Positive' : 'Negative'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Expenses by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No expense data available. Add some expenses to see the breakdown!</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">
                              ${data.value.toFixed(2)} ({data.count} transactions)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Repeat, Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, addWeeks, addMonths, addQuarters, addYears } from 'date-fns';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string | null;
  date: string;
  is_recurring: boolean;
  recurring_frequency: string | null;
  next_occurrence: string | null;
}

interface RecurringTransactionsProps {
  refreshTrigger: number;
}

export const RecurringTransactions = ({ refreshTrigger }: RecurringTransactionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const allTransactions = data || [];
      setTransactions(allTransactions);
      setRecurringTransactions(allTransactions.filter(t => t.is_recurring));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, refreshTrigger]);

  const markAsRecurring = async (transactionId: string, frequency: string) => {
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const nextOccurrence = calculateNextOccurrence(new Date(transaction.date), frequency);

      const { error } = await supabase
        .from('transactions')
        .update({
          is_recurring: true,
          recurring_frequency: frequency,
          next_occurrence: nextOccurrence.toISOString().split('T')[0]
        })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Transaction marked as recurring.",
      });

      fetchTransactions();
    } catch (error) {
      console.error('Error marking transaction as recurring:', error);
      toast({
        title: "Error",
        description: "Failed to mark transaction as recurring.",
        variant: "destructive"
      });
    }
  };

  const removeRecurring = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          is_recurring: false,
          recurring_frequency: null,
          next_occurrence: null
        })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Recurring status removed.",
      });

      fetchTransactions();
    } catch (error) {
      console.error('Error removing recurring status:', error);
      toast({
        title: "Error",
        description: "Failed to remove recurring status.",
        variant: "destructive"
      });
    }
  };

  const calculateNextOccurrence = (date: Date, frequency: string): Date => {
    switch (frequency) {
      case 'weekly':
        return addWeeks(date, 1);
      case 'biweekly':
        return addWeeks(date, 2);
      case 'monthly':
        return addMonths(date, 1);
      case 'quarterly':
        return addQuarters(date, 1);
      case 'yearly':
        return addYears(date, 1);
      default:
        return addMonths(date, 1);
    }
  };

  const generateForecast = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    const forecastExpenses = recurringTransactions
      .filter(t => t.type === 'expense' && t.next_occurrence)
      .filter(t => {
        const nextOccurrence = new Date(t.next_occurrence!);
        return nextOccurrence.getMonth() === nextMonth.getMonth() && 
               nextOccurrence.getFullYear() === nextMonth.getFullYear();
      });

    const totalForecast = forecastExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

    return { forecastExpenses, totalForecast };
  };

  const nonRecurringTransactions = transactions.filter(t => !t.is_recurring);
  const { forecastExpenses, totalForecast } = generateForecast();

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">Loading recurring transactions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recurring Transactions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Recurring Transactions ({recurringTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recurringTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Repeat className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recurring transactions yet. Mark transactions as recurring below!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recurringTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{transaction.category}</span>
                        <Badge variant="outline">
                          {transaction.recurring_frequency}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Next: {transaction.next_occurrence ? format(new Date(transaction.next_occurrence), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecurring(transaction.id)}
                    >
                      Remove Recurring
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mark Transactions as Recurring */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Mark as Recurring</CardTitle>
        </CardHeader>
        <CardContent>
          {nonRecurringTransactions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>All transactions are already marked as recurring or non-recurring.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {nonRecurringTransactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{transaction.category}</span>
                      <div className="text-xs text-gray-500">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      ${transaction.amount.toFixed(2)}
                    </span>
                    <Select onValueChange={(frequency) => markAsRecurring(transaction.id, frequency)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Month Forecast */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next Month Recurring Expenses Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          {forecastExpenses.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>No recurring expenses scheduled for next month.</p>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-800">
                  Total Forecast: ${totalForecast.toFixed(2)}
                </div>
                <div className="text-sm text-blue-600">
                  Based on {forecastExpenses.length} recurring expense{forecastExpenses.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="space-y-2">
                {forecastExpenses.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{transaction.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.recurring_frequency}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

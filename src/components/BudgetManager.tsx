
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Target, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Budget {
  id: string;
  category: string;
  monthly_limit: number;
  month: number;
  year: number;
  usage?: number;
}

interface BudgetManagerProps {
  refreshTrigger: number;
}

export const BudgetManager = ({ refreshTrigger }: BudgetManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    monthly_limit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
  ];

  const fetchBudgets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('category');

      if (error) throw error;

      // Calculate usage for each budget
      const budgetsWithUsage = await Promise.all(
        (data || []).map(async (budget) => {
          const { data: usageData, error: usageError } = await supabase
            .rpc('get_budget_usage', {
              budget_user_id: user.id,
              budget_category: budget.category,
              budget_month: budget.month,
              budget_year: budget.year
            });

          if (usageError) {
            console.error('Error fetching budget usage:', usageError);
            return { ...budget, usage: 0 };
          }

          return { ...budget, usage: Number(usageData) || 0 };
        })
      );

      setBudgets(budgetsWithUsage);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: "Error",
        description: "Failed to load budgets.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user, refreshTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          category: formData.category,
          monthly_limit: parseFloat(formData.monthly_limit),
          month: formData.month,
          year: formData.year
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Budget created successfully.",
      });

      setFormData({
        category: '',
        monthly_limit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      setShowForm(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBudgets(prev => prev.filter(b => b.id !== id));
      toast({
        title: "Success!",
        description: "Budget deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget.",
        variant: "destructive"
      });
    }
  };

  const getBudgetStatus = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100;
    if (percentage >= 100) return { 
      status: 'exceeded', 
      variant: 'destructive' as const, 
      icon: AlertTriangle 
    };
    if (percentage >= 80) return { 
      status: 'warning', 
      variant: 'secondary' as const, 
      icon: AlertTriangle 
    };
    return { 
      status: 'good', 
      variant: 'default' as const, 
      icon: CheckCircle 
    };
  };

  const getAISuggestion = (budget: Budget) => {
    if (!budget.usage) return null;
    
    const percentage = (budget.usage / budget.monthly_limit) * 100;
    if (percentage >= 100) {
      return `You've exceeded your ${budget.category} budget by $${(budget.usage - budget.monthly_limit).toFixed(2)}. Consider reducing spending in this category.`;
    }
    if (percentage >= 80) {
      return `You're at ${percentage.toFixed(0)}% of your ${budget.category} budget. Consider monitoring spending closely.`;
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">Loading budgets...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Manager
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="monthly_limit">Monthly Limit ($)</Label>
                <Input
                  id="monthly_limit"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="500.00"
                  value={formData.monthly_limit}
                  onChange={(e) => setFormData({ ...formData, monthly_limit: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="month">Month</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(value) => setFormData({ ...formData, month: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Create Budget</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No budgets set. Create your first budget to track spending!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const { status, variant, icon: Icon } = getBudgetStatus(budget.usage || 0, budget.monthly_limit);
              const percentage = Math.min(((budget.usage || 0) / budget.monthly_limit) * 100, 100);
              const suggestion = getAISuggestion(budget);

              return (
                <div key={budget.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{budget.category}</h3>
                      <Badge variant={variant}>
                        <Icon className="h-3 w-3 mr-1" />
                        {status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {new Date(2024, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Spent: ${(budget.usage || 0).toFixed(2)}</span>
                      <span>Limit: ${budget.monthly_limit.toFixed(2)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {percentage.toFixed(1)}% of budget used
                    </div>
                  </div>

                  {suggestion && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <strong>AI Suggestion:</strong> {suggestion}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

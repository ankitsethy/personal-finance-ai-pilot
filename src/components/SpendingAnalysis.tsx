
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Coffee, Car, Home, Smartphone, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export const SpendingAnalysis = () => {
  const categories = [
    { name: 'Housing', amount: 1800, budget: 2000, icon: Home, color: 'blue', trend: 'down', change: -5 },
    { name: 'Food & Dining', amount: 650, budget: 600, icon: Coffee, color: 'green', trend: 'up', change: 8 },
    { name: 'Transportation', amount: 420, budget: 500, icon: Car, color: 'purple', trend: 'down', change: -12 },
    { name: 'Shopping', amount: 380, budget: 300, icon: ShoppingCart, color: 'pink', trend: 'up', change: 27 },
    { name: 'Subscriptions', amount: 180, budget: 150, icon: Smartphone, color: 'orange', trend: 'up', change: 20 },
  ];

  return (
    <div className="grid gap-6">
      {/* Spending Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Spending Analysis</CardTitle>
          <CardDescription>AI-powered categorization and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Spending by Category</h4>
              <div className="space-y-4">
                {categories.map((category) => {
                  const percentage = (category.amount / category.budget) * 100;
                  const IconComponent = category.icon;
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 text-${category.color}-600`} />
                          <span className="font-medium">{category.name}</span>
                          <Badge variant={percentage > 100 ? "destructive" : "secondary"}>
                            {percentage > 100 ? "Over Budget" : "On Track"}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${category.amount}</div>
                          <div className="text-sm text-gray-500">of ${category.budget}</div>
                        </div>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <div className={`flex items-center gap-1 ${
                          category.trend === 'up' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {category.trend === 'up' ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          {Math.abs(category.change)}% vs last month
                        </div>
                        <div className="text-gray-500">
                          {Math.round(percentage)}% of budget
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Smart Insights</h4>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-yellow-900">Overspending Alert</h5>
                      <p className="text-sm text-yellow-800 mb-2">
                        You've exceeded your shopping budget by 27% this month.
                      </p>
                      <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-green-900">Great Progress!</h5>
                      <p className="text-sm text-green-800 mb-2">
                        Transportation costs are down 12% - you're saving $58/month.
                      </p>
                      <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                        Keep It Up
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-900">Subscription Optimization</h5>
                      <p className="text-sm text-blue-800 mb-2">
                        AI detected 3 unused subscriptions. Cancel them to save $45/month.
                      </p>
                      <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                        Review Subscriptions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Smart categorization and spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Today', merchant: 'Whole Foods Market', amount: -87.43, category: 'Food & Dining', icon: Coffee },
              { date: 'Yesterday', merchant: 'Shell Gas Station', amount: -45.20, category: 'Transportation', icon: Car },
              { date: 'Dec 8', merchant: 'Amazon Prime', amount: -14.99, category: 'Subscriptions', icon: Smartphone },
              { date: 'Dec 8', merchant: 'Starbucks', amount: -6.75, category: 'Food & Dining', icon: Coffee },
              { date: 'Dec 7', merchant: 'Target', amount: -156.82, category: 'Shopping', icon: ShoppingCart },
            ].map((transaction, index) => {
              const IconComponent = transaction.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{transaction.merchant}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{transaction.date}</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

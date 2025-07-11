
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, DollarSign } from 'lucide-react';

interface FinancialOverviewProps {
  userProfile: any;
}

export const FinancialOverview = ({ userProfile }: FinancialOverviewProps) => {
  return (
    <div className="grid gap-6">
      {/* Financial Health Score */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Financial Health Score
          </CardTitle>
          <CardDescription>Your overall financial wellness based on AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-green-600">78</div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Good</Badge>
          </div>
          <Progress value={78} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Emergency Fund</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Debt Ratio</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>Diversification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Savings Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Assets vs Liabilities */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assets vs Liabilities</CardTitle>
            <CardDescription>Your financial position breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-700">Total Assets</span>
                  <span className="font-semibold text-green-700">$67,432</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Savings Account</span>
                    <span>$15,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Portfolio</span>
                    <span>$32,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Checking Account</span>
                    <span>$4,432</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Assets</span>
                    <span>$15,000</span>
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-red-700">Total Liabilities</span>
                  <span className="font-semibold text-red-700">$19,600</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Credit Cards</span>
                    <span>$3,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student Loan</span>
                    <span>$16,400</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Net Worth</span>
                  <span className="font-bold text-xl text-green-600">$47,832</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Cash Flow */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Cash Flow</CardTitle>
            <CardDescription>Income vs expenses analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Monthly Income
                  </span>
                  <span className="font-semibold text-green-700">$4,800</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Salary (after tax)</span>
                    <span>$4,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Side Income</span>
                    <span>$600</span>
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Monthly Expenses
                  </span>
                  <span className="font-semibold text-red-700">$3,555</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Housing</span>
                    <span>$1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food & Dining</span>
                    <span>$650</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transportation</span>
                    <span>$420</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilities</span>
                    <span>$285</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other</span>
                    <span>$400</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Available to Save</span>
                  <span className="font-bold text-xl text-green-600">$1,245</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">26% of income - Excellent!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Personalized advice based on your financial profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Optimize Savings</h4>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Increase your emergency fund to 6 months of expenses. You're currently at 4.2 months.
              </p>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                View Plan
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Investment Opportunity</h4>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Consider increasing your index fund allocation by 5% for better diversification.
              </p>
              <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                Learn More
              </Button>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">Goal Achievement</h4>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                You're on track to reach your house down payment goal 3 months early!
              </p>
              <Button size="sm" variant="outline" className="text-purple-600 border-purple-200">
                View Goals
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

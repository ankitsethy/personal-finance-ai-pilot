
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, PieChart, DollarSign, Target, AlertTriangle } from 'lucide-react';

interface InvestmentPortfolioProps {
  userProfile: any;
}

export const InvestmentPortfolio = ({ userProfile }: InvestmentPortfolioProps) => {
  const portfolio = [
    { name: 'S&P 500 Index Fund', symbol: 'SPY', allocation: 45, value: 14760, return: 8.2, risk: 'Medium' },
    { name: 'Total Stock Market', symbol: 'VTI', allocation: 25, value: 8200, return: 7.8, risk: 'Medium' },
    { name: 'International Fund', symbol: 'VTIAX', allocation: 15, value: 4920, return: 5.4, risk: 'Medium-High' },
    { name: 'Bond Index Fund', symbol: 'BND', allocation: 10, value: 3280, return: 2.1, risk: 'Low' },
    { name: 'Tech Growth Fund', symbol: 'QQQ', allocation: 5, value: 1640, return: 12.3, risk: 'High' },
  ];

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);
  const averageReturn = portfolio.reduce((sum, item) => sum + (item.return * item.allocation / 100), 0);

  return (
    <div className="grid gap-6">
      {/* Portfolio Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Investment Portfolio
          </CardTitle>
          <CardDescription>Personalized portfolio analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Portfolio Value</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+$2,840 (9.5%)</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{averageReturn.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">YTD Return</div>
              <div className="text-xs text-gray-500 mt-1">vs 7.2% S&P 500</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userProfile?.riskTolerance === 'conservative' ? 'Low' : 
                 userProfile?.riskTolerance === 'moderate' ? 'Medium' : 'High'}
              </div>
              <div className="text-sm text-gray-600">Risk Level</div>
              <div className="text-xs text-gray-500 mt-1">Based on your profile</div>
            </div>
          </div>

          {/* Portfolio Allocation */}
          <div>
            <h4 className="font-semibold mb-4">Asset Allocation</h4>
            <div className="space-y-4">
              {portfolio.map((asset, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{asset.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {asset.symbol}
                      </Badge>
                      <Badge 
                        variant={asset.risk === 'Low' ? 'secondary' : asset.risk === 'High' ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {asset.risk} Risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${asset.value.toLocaleString()}</div>
                      <div className="text-sm text-green-600">+{asset.return}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={asset.allocation} className="flex-1 h-2" />
                    <span className="text-sm text-gray-500 w-12">{asset.allocation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>AI Investment Insights</CardTitle>
            <CardDescription>Personalized recommendations based on your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-blue-900">Portfolio Optimization</h5>
                    <p className="text-sm text-blue-800 mb-2">
                      Consider rebalancing: Your tech allocation is 2% above optimal for your risk profile.
                    </p>
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                      View Rebalancing Plan
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-green-900">Tax Optimization</h5>
                    <p className="text-sm text-green-800 mb-2">
                      Maximize your 401k contribution to save $1,200 in taxes this year.
                    </p>
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-purple-900">Dollar-Cost Averaging</h5>
                    <p className="text-sm text-purple-800 mb-2">
                      Set up automatic investing of $500/month to reduce timing risk.
                    </p>
                    <Button size="sm" variant="outline" className="text-purple-700 border-purple-300">
                      Set Up Auto-Invest
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>How your investments are performing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">+8.4%</div>
                  <div className="text-sm text-gray-600">1 Year Return</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">0.15%</div>
                  <div className="text-sm text-gray-600">Expense Ratio</div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold mb-2">Risk Metrics</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Beta</span>
                    <span className="font-medium">0.92</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sharpe Ratio</span>
                    <span className="font-medium">1.34</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Max Drawdown</span>
                    <span className="font-medium text-red-600">-12.3%</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold mb-2">Diversification Score</h5>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={78} className="flex-1 h-2" />
                  <span className="text-sm font-medium">78/100</span>
                </div>
                <p className="text-sm text-gray-600">
                  Good diversification. Consider adding REITs for better balance.
                </p>
              </div>

              <Button variant="outline" className="w-full">
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

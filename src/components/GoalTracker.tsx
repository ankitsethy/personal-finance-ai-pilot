
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Home, GraduationCap, Plane, Car, Plus, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export const GoalTracker = () => {
  const goals = [
    {
      id: 1,
      title: 'House Down Payment',
      target: 80000,
      current: 47800,
      deadline: '2025-12-31',
      icon: Home,
      color: 'blue',
      monthlyContribution: 1200,
      onTrack: true
    },
    {
      id: 2,
      title: 'Emergency Fund',
      target: 24000,
      current: 18500,
      deadline: '2024-08-31',
      icon: Target,
      color: 'green',
      monthlyContribution: 800,
      onTrack: true
    },
    {
      id: 3,
      title: 'European Vacation',
      target: 8000,
      current: 3200,
      deadline: '2024-06-15',
      icon: Plane,
      color: 'purple',
      monthlyContribution: 400,
      onTrack: false
    },
    {
      id: 4,
      title: 'New Car Fund',
      target: 25000,
      current: 5800,
      deadline: '2025-03-31',
      icon: Car,
      color: 'orange',
      monthlyContribution: 600,
      onTrack: true
    }
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateMonthsRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  return (
    <div className="grid gap-6">
      {/* Goals Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Goals</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Target</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${goals.reduce((sum, goal) => sum + goal.target, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${goals.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">On Track</p>
                <p className="text-2xl font-bold text-green-600">
                  {goals.filter(goal => goal.onTrack).length}/{goals.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Goals */}
      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const monthsRemaining = calculateMonthsRemaining(goal.deadline);
          const IconComponent = goal.icon;
          const remaining = goal.target - goal.current;
          const monthlyNeeded = remaining / monthsRemaining;

          return (
            <Card key={goal.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 bg-${goal.color}-100 rounded-full flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 text-${goal.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      <p className="text-sm text-gray-600">
                        Target: ${goal.target.toLocaleString()} by{' '}
                        {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={goal.onTrack ? "secondary" : "destructive"}>
                    {goal.onTrack ? "On Track" : "Behind"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">{progress.toFixed(1)}% complete</span>
                      <span className="text-sm text-gray-500">
                        ${remaining.toLocaleString()} remaining
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-sm font-medium">${goal.monthlyContribution}</div>
                      <div className="text-xs text-gray-500">Current Monthly</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${monthlyNeeded > goal.monthlyContribution ? 'text-red-600' : 'text-green-600'}`}>
                        ${Math.round(monthlyNeeded)}
                      </div>
                      <div className="text-xs text-gray-500">Needed Monthly</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{monthsRemaining}</div>
                      <div className="text-xs text-gray-500">Months Left</div>
                    </div>
                  </div>

                  {!goal.onTrack && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Action needed:</strong> Increase monthly contribution by{' '}
                        ${Math.round(monthlyNeeded - goal.monthlyContribution)} to stay on track.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Goal */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg border-dashed border-2 border-gray-300">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Add New Financial Goal</h3>
            <p className="text-gray-600 mb-4">
              Set a new savings target and let our AI help you create an actionable plan.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Create New Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>AI Goal Optimization</CardTitle>
          <CardDescription>Smart recommendations to achieve your goals faster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Priority Adjustment</h4>
              <p className="text-sm text-blue-800 mb-3">
                Focus on your emergency fund first - it's 77% complete and provides financial security for other goals.
              </p>
              <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                Adjust Priorities
              </Button>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Income Optimization</h4>
              <p className="text-sm text-green-800 mb-3">
                Based on your skills, a 15% salary increase could accelerate all goals by 3-4 months.
              </p>
              <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                Career Guidance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

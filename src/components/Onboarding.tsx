
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Shield, DollarSign, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: any) => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    income: '',
    riskTolerance: '',
    financialGoals: '',
    currentSavings: '',
    monthlyExpenses: '',
    investmentExperience: ''
  });

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FinanceAI</h1>
          <p className="text-gray-600">Your personal AI wealth advisor - secure, private, and personalized</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i < step ? <CheckCircle className="h-5 w-5" /> : i}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><DollarSign className="h-5 w-5 text-blue-600" /> Personal Information</>}
              {step === 2 && <><TrendingUp className="h-5 w-5 text-green-600" /> Financial Situation</>}
              {step === 3 && <><Target className="h-5 w-5 text-purple-600" /> Goals & Risk Profile</>}
              {step === 4 && <><Shield className="h-5 w-5 text-indigo-600" /> Investment Experience</>}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let's start with some basic information about you"}
              {step === 2 && "Tell us about your current financial situation"}
              {step === 3 && "What are your financial goals and risk tolerance?"}
              {step === 4 && "Final step - your investment background"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={profile.age}
                      onChange={(e) => updateProfile('age', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Income</Label>
                  <Select onValueChange={(value) => updateProfile('income', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<30k">Less than $30,000</SelectItem>
                      <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
                      <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                      <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                      <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                      <SelectItem value=">150k">More than $150,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="savings">Current Savings</Label>
                    <Select onValueChange={(value) => updateProfile('currentSavings', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1k">Less than $1,000</SelectItem>
                        <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                        <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                        <SelectItem value=">50k">More than $50,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Monthly Expenses</Label>
                    <Select onValueChange={(value) => updateProfile('monthlyExpenses', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1k">Less than $1,000</SelectItem>
                        <SelectItem value="1k-2k">$1,000 - $2,000</SelectItem>
                        <SelectItem value="2k-4k">$2,000 - $4,000</SelectItem>
                        <SelectItem value="4k-6k">$4,000 - $6,000</SelectItem>
                        <SelectItem value=">6k">More than $6,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="goals">Financial Goals</Label>
                  <Textarea
                    id="goals"
                    placeholder="e.g., Save for a house down payment, build retirement fund, pay off debt..."
                    value={profile.financialGoals}
                    onChange={(e) => updateProfile('financialGoals', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk Tolerance</Label>
                  <Select onValueChange={(value) => updateProfile('riskTolerance', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How comfortable are you with investment risk?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative - Prefer stable, low-risk investments</SelectItem>
                      <SelectItem value="moderate">Moderate - Balanced approach to risk and return</SelectItem>
                      <SelectItem value="aggressive">Aggressive - Comfortable with high-risk, high-reward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="experience">Investment Experience</Label>
                  <Select onValueChange={(value) => updateProfile('investmentExperience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What's your investment experience?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - New to investing</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some experience with basic investments</SelectItem>
                      <SelectItem value="advanced">Advanced - Experienced with various investment types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Your Privacy is Our Priority
                  </h4>
                  <p className="text-sm text-blue-700">
                    All your financial data is encrypted and never shared. Our AI processes your information locally 
                    to provide personalized advice while keeping your data completely private and secure.
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2"
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                {step === 4 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

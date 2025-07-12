
import React, { useState } from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { TransactionChart } from '@/components/TransactionChart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, DollarSign } from 'lucide-react';

const Transactions = () => {
  const { signOut, user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Financial Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.email?.split('@')[0]}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>

          {/* Transaction List */}
          <div className="lg:col-span-2">
            <TransactionList refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Charts and Summary */}
        <div className="mt-8">
          <TransactionChart refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;

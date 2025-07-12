
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ExportFeaturesProps {
  refreshTrigger: number;
}

export const ExportFeatures = ({ refreshTrigger }: ExportFeaturesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exportType, setExportType] = useState<'transactions' | 'summary'>('transactions');

  const fetchTransactionsForExport = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const exportToCSV = async () => {
    try {
      setLoading(true);
      const transactions = await fetchTransactionsForExport();

      if (exportType === 'transactions') {
        // Export detailed transactions
        const csvContent = [
          ['Date', 'Type', 'Category', 'Amount', 'Note', 'Recurring'],
          ...transactions.map(t => [
            format(new Date(t.date), 'yyyy-MM-dd'),
            t.type,
            t.category,
            t.amount.toString(),
            t.note || '',
            t.is_recurring ? 'Yes' : 'No'
          ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        downloadFile(csvContent, `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
      } else {
        // Export summary by category
        const summary = transactions.reduce((acc, t) => {
          const key = `${t.type}_${t.category}`;
          if (!acc[key]) {
            acc[key] = { type: t.type, category: t.category, total: 0, count: 0 };
          }
          acc[key].total += Number(t.amount);
          acc[key].count += 1;
          return acc;
        }, {} as Record<string, any>);

        const csvContent = [
          ['Type', 'Category', 'Total Amount', 'Transaction Count'],
          ...Object.values(summary).map((s: any) => [
            s.type,
            s.category,
            s.total.toFixed(2),
            s.count.toString()
          ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        downloadFile(csvContent, `summary_${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
      }

      toast({
        title: "Success!",
        description: "Data exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      const transactions = await fetchTransactionsForExport();

      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Financial Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .income { color: #22c55e; }
            .expense { color: #ef4444; }
            .summary { background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Financial Report</h1>
          <p>Generated on: ${format(new Date(), 'MMMM dd, yyyy')}</p>
          
          ${exportType === 'transactions' ? `
            <h2>Transaction Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Recurring</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.map(t => `
                  <tr>
                    <td>${format(new Date(t.date), 'MMM dd, yyyy')}</td>
                    <td class="${t.type}">${t.type}</td>
                    <td>${t.category}</td>
                    <td class="${t.type}">$${t.amount.toFixed(2)}</td>
                    <td>${t.note || '-'}</td>
                    <td>${t.is_recurring ? 'Yes' : 'No'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <h2>Summary by Category</h2>
            <div class="summary">
              <h3>Totals</h3>
              <p><strong>Total Income:</strong> $${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}</p>
              <p><strong>Total Expenses:</strong> $${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}</p>
              <p><strong>Net Income:</strong> $${(
                transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) -
                transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
              ).toFixed(2)}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Total Amount</th>
                  <th>Transaction Count</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(
                  transactions.reduce((acc, t) => {
                    const key = `${t.type}_${t.category}`;
                    if (!acc[key]) {
                      acc[key] = { type: t.type, category: t.category, total: 0, count: 0 };
                    }
                    acc[key].total += Number(t.amount);
                    acc[key].count += 1;
                    return acc;
                  }, {} as Record<string, any>)
                ).map(([_, s]: [string, any]) => `
                  <tr>
                    <td class="${s.type}">${s.type}</td>
                    <td>${s.category}</td>
                    <td class="${s.type}">$${s.total.toFixed(2)}</td>
                    <td>${s.count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </body>
        </html>
      `;

      // Convert HTML to PDF using browser's print functionality
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load, then print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }

      toast({
        title: "Success!",
        description: "PDF export opened in new window.",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export PDF.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'pdf') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV File
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF Report
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Export Type</Label>
              <Select value={exportType} onValueChange={(value: 'transactions' | 'summary') => setExportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">Detailed Transactions</SelectItem>
                  <SelectItem value="summary">Category Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Export Preview</h4>
            <p className="text-sm text-gray-600">
              {exportType === 'transactions' 
                ? 'Export all transaction details including date, type, category, amount, notes, and recurring status.'
                : 'Export a summary showing totals and counts by category and transaction type.'
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Format: {exportFormat.toUpperCase()} 
              {exportFormat === 'pdf' && ' (opens in new window for printing/saving)'}
            </p>
          </div>

          <Button 
            onClick={handleExport} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

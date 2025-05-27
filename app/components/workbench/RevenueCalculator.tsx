import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { RevenueCalculatorInput, RevenueDataPoint } from '~/types/product-coach';
import { Input } from '~/components/ui/Input'; // Assuming Input component exists
import { Label } from '~/components/ui/Label'; // Assuming Label component exists

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RevenueCalculatorProps {
  // Optional: Pre-fill some defaults based on analysis?
  initialInputs?: Partial<RevenueCalculatorInput>; 
}

export const RevenueCalculator = ({ initialInputs }: RevenueCalculatorProps) => {
  const [inputs, setInputs] = useState<RevenueCalculatorInput>({
    pricingModelType: 'subscription',
    monthlyVisitors: 1000,
    conversionRate: 0.02, // 2%
    monthlySubscriptionPrice: 10,
    churnRate: 0.05, // 5%
    projectionMonths: 12,
    avgRevenuePerUser: 50, // Default for one-time
    ...initialInputs, // Override defaults with props
  });

  const [projections, setProjections] = useState<RevenueDataPoint[]>([]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Calculate projections when inputs change
  useEffect(() => {
    const calculatedProjections: RevenueDataPoint[] = [];
    let currentUsers = 0;
    let monthlyRevenue = 0;
    const months = inputs.projectionMonths || 12;

    // Basic calculation logic (can be refined)
    for (let month = 1; month <= months; month++) {
      let newUsers = (inputs.monthlyVisitors || 0) * (inputs.conversionRate || 0);
      
      if (inputs.pricingModelType === 'subscription') {
        // Subscription Model Calculation
        const churnedUsers = currentUsers * (inputs.churnRate || 0);
        currentUsers = currentUsers - churnedUsers + newUsers;
        monthlyRevenue = currentUsers * (inputs.monthlySubscriptionPrice || 0);
      } else if (inputs.pricingModelType === 'one-time') {
        // One-Time Purchase Model Calculation (Simplified)
        currentUsers += newUsers; // Accumulate total users over time
        monthlyRevenue = newUsers * (inputs.avgRevenuePerUser || 0); // Revenue from new users this month
      } else {
         // Other models - simple placeholder
         monthlyRevenue = 0;
         currentUsers = 0;
      }
      
      // Ensure non-negative values
      currentUsers = Math.max(0, currentUsers);
      monthlyRevenue = Math.max(0, monthlyRevenue);

      calculatedProjections.push({
        month,
        revenue: parseFloat(monthlyRevenue.toFixed(2)),
        users: Math.round(currentUsers),
      });
    }
    setProjections(calculatedProjections);

  }, [inputs]);

  // Prepare data for the chart
  const chartData = useMemo(() => ({
    labels: projections.map(p => `Month ${p.month}`),
    datasets: [
      {
        label: 'Projected Monthly Revenue',
        data: projections.map(p => p.revenue),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
      },
       {
        label: 'Projected Active Users', // Optional: add user data
        data: projections.map(p => p.users),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        yAxisID: 'y1', // Assign to secondary axis
      },
    ],
  }), [projections]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Revenue & User Growth Projection' },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: { // Define axes
      y: { // Primary axis (Revenue)
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Revenue ($' },
      },
      y1: { // Secondary axis (Users)
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'Active Users' },
        grid: {
          drawOnChartArea: false, // only draw grid lines for the first Y axis
        },
      },
    },
  };

  return (
    <div className="revenue-calculator space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {/* Input fields for model type, visitors, conversion, price, churn etc. */}
         <div>
           <Label htmlFor="pricingModelType">Pricing Model</Label>
           <select 
             id="pricingModelType"
             name="pricingModelType"
             value={inputs.pricingModelType}
             onChange={handleInputChange}
             className="w-full p-2 rounded border bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor mt-1"
           >
             <option value="subscription">Subscription</option>
             <option value="one-time">One-Time Purchase</option>
             <option value="other">Other (Manual/Placeholder)</option>
           </select>
         </div>
          <div>
           <Label htmlFor="monthlyVisitors">Est. Monthly Visitors/Leads</Label>
           <Input 
             type="number" 
             id="monthlyVisitors"
             name="monthlyVisitors" 
             value={inputs.monthlyVisitors} 
             onChange={handleInputChange} 
             placeholder="e.g., 1000"
           />
         </div>
         <div>
           <Label htmlFor="conversionRate">Conversion Rate (0-1)</Label>
           <Input 
             type="number" 
             id="conversionRate"
             name="conversionRate"
             step="0.001"
             min="0"
             max="1"
             value={inputs.conversionRate} 
             onChange={handleInputChange} 
             placeholder="e.g., 0.02 for 2%"
           />
         </div>

         {/* Conditional Inputs based on model type */}
         {inputs.pricingModelType === 'subscription' && (
            <>
              <div>
                <Label htmlFor="monthlySubscriptionPrice">Avg. Monthly Price ($)</Label>
                <Input 
                  type="number" 
                  id="monthlySubscriptionPrice"
                  name="monthlySubscriptionPrice" 
                  value={inputs.monthlySubscriptionPrice} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <Label htmlFor="churnRate">Monthly Churn Rate (0-1)</Label>
                <Input 
                  type="number" 
                  id="churnRate"
                  name="churnRate"
                  step="0.001"
                  min="0"
                  max="1"
                  value={inputs.churnRate} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 0.05 for 5%"
                />
              </div>
           </>
         )}
         {inputs.pricingModelType === 'one-time' && (
             <div>
               <Label htmlFor="avgRevenuePerUser">Avg. Revenue per User ($)</Label>
               <Input 
                 type="number" 
                 id="avgRevenuePerUser"
                 name="avgRevenuePerUser" 
                 value={inputs.avgRevenuePerUser} 
                 onChange={handleInputChange} 
                 placeholder="e.g., 50"
               />
             </div>
         )}

         <div>
           <Label htmlFor="projectionMonths">Projection Months</Label>
           <Input 
             type="number" 
             id="projectionMonths"
             name="projectionMonths"
             step="1"
             min="1"
             max="60"
             value={inputs.projectionMonths} 
             onChange={handleInputChange} 
             placeholder="e.g., 12"
           />
         </div>
      </div>

      {/* Chart Section */}
      <div className="h-72 md:h-96 relative mt-6">
        {projections.length > 0 ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full text-bolt-elements-textTertiary italic">
            Enter parameters to see projections.
          </div>
        )}
      </div>
    </div>
  );
}; 
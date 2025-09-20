import type { Express } from "express";
import { z } from "zod";

// Schema for sales calculation request
const SalesRequestSchema = z.object({
  monthly_sales: z.number().min(0),
  ad_clicks: z.number().int().min(0),
  cost_per_click: z.number().min(0)
});

interface SalesCalculationResult {
  monthly_sales: number;
  sales_fee: number;
  ad_fee: number;
  total_cost: number;
  retailer_net: number;
  profit_margin: number;
}

export function registerBusinessCalculatorRoutes(app: Express) {
  // Calculate retailer fees and costs
  app.post('/api/business/calculate-fees', async (req, res) => {
    try {
      const data = SalesRequestSchema.parse(req.body);
      
      const sales_fee_rate = 0.05; // 5% base transaction fee
      const ad_fee = data.ad_clicks * data.cost_per_click;
      const sales_fee = data.monthly_sales * sales_fee_rate;
      const total_cost = sales_fee + ad_fee;
      const retailer_net = data.monthly_sales - total_cost;
      const profit_margin = data.monthly_sales > 0 ? (retailer_net / data.monthly_sales) * 100 : 0;

      const result: SalesCalculationResult = {
        monthly_sales: data.monthly_sales,
        sales_fee: Math.round(sales_fee * 100) / 100,
        ad_fee: Math.round(ad_fee * 100) / 100,
        total_cost: Math.round(total_cost * 100) / 100,
        retailer_net: Math.round(retailer_net * 100) / 100,
        profit_margin: Math.round(profit_margin * 100) / 100
      };

      res.json(result);
    } catch (error) {
      console.error('Error calculating business fees:', error);
      res.status(400).json({ 
        message: 'Invalid request data',
        error: error instanceof z.ZodError ? error.errors : 'Unknown error'
      });
    }
  });

  // Get fee structure information
  app.get('/api/business/fee-structure', async (req, res) => {
    res.json({
      sales_fee_rate: 0.05,
      description: "5% transaction fee on all sales",
      additional_fees: {
        advertising: "Variable based on clicks and CPC",
        setup: 0,
        monthly: 0
      },
      benefits: [
        "Multi-retailer cart integration",
        "SPIRAL loyalty program access",
        "Local discovery features",
        "Social sharing tools",
        "Analytics dashboard"
      ]
    });
  });

  // Calculate projected earnings
  app.post('/api/business/projections', async (req, res) => {
    try {
      const schema = z.object({
        current_monthly_sales: z.number().min(0),
        projected_growth_rate: z.number().min(0).max(500), // Max 500% growth
        months: z.number().int().min(1).max(12)
      });

      const data = schema.parse(req.body);
      const projections = [];

      for (let month = 1; month <= data.months; month++) {
        const projected_sales = data.current_monthly_sales * Math.pow(1 + (data.projected_growth_rate / 100), month / 12);
        const sales_fee = projected_sales * 0.05;
        const net_earnings = projected_sales - sales_fee;

        projections.push({
          month,
          projected_sales: Math.round(projected_sales * 100) / 100,
          sales_fee: Math.round(sales_fee * 100) / 100,
          net_earnings: Math.round(net_earnings * 100) / 100
        });
      }

      res.json({
        projections,
        summary: {
          total_projected_sales: Math.round(projections.reduce((sum, p) => sum + p.projected_sales, 0) * 100) / 100,
          total_fees: Math.round(projections.reduce((sum, p) => sum + p.sales_fee, 0) * 100) / 100,
          total_net: Math.round(projections.reduce((sum, p) => sum + p.net_earnings, 0) * 100) / 100
        }
      });
    } catch (error) {
      console.error('Error calculating projections:', error);
      res.status(400).json({ 
        message: 'Invalid request data',
        error: error instanceof z.ZodError ? error.errors : 'Unknown error'
      });
    }
  });
}
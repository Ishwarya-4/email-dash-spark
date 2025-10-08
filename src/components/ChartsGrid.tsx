import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card } from '@/components/ui/card';
import { EmailData } from '@/utils/dataParser';

interface ChartsGridProps {
  data: EmailData[];
}

export const ChartsGrid = ({ data }: ChartsGridProps) => {
  // Monthly Opens & Clicks Bar Chart
  const opensClicksData = useMemo(() => {
    const monthlyData = data.reduce((acc: any, item) => {
      if (!acc[item.month]) {
        acc[item.month] = { opens: 0, clicks: 0 };
      }
      acc[item.month].opens += item.opens;
      acc[item.month].clicks += item.clicks;
      return acc;
    }, {});

    const months = Object.keys(monthlyData).sort();
    const opens = months.map(month => monthlyData[month].opens);
    const clicks = months.map(month => monthlyData[month].clicks);

    return {
      data: [
        {
          x: months,
          y: opens,
          type: 'bar' as const,
          name: 'Opens',
          marker: { color: 'hsl(221, 83%, 53%)' },
        },
        {
          x: months,
          y: clicks,
          type: 'bar' as const,
          name: 'Clicks',
          marker: { color: 'hsl(262, 83%, 58%)' },
        },
      ],
      layout: {
        title: { text: 'Monthly Opens & Clicks' },
        xaxis: { title: { text: 'Month' } },
        yaxis: { title: { text: 'Count' } },
        barmode: 'group' as const,
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'inherit' },
      },
    };
  }, [data]);

  // Delivery vs Bounces Pie Chart
  const deliveryBouncesData = useMemo(() => {
    const delivered = data.reduce((sum, item) => sum + item.delivered, 0);
    const bounces = data.reduce((sum, item) => sum + item.bounces, 0);

    return {
      data: [
        {
          values: [delivered, bounces],
          labels: ['Delivered', 'Bounces'],
          type: 'pie' as const,
          marker: {
            colors: ['hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)'],
          },
        },
      ],
      layout: {
        title: { text: 'Delivery vs Bounces' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'inherit' },
      },
    };
  }, [data]);

  // Engagement Metrics Bar Chart
  const engagementData = useMemo(() => {
    const totalSent = data.reduce((sum, item) => sum + item.total_sent, 0);
    const opens = data.reduce((sum, item) => sum + item.opens, 0);
    const clicks = data.reduce((sum, item) => sum + item.clicks, 0);

    const openRate = totalSent > 0 ? (opens / totalSent) * 100 : 0;
    const clickRate = totalSent > 0 ? (clicks / totalSent) * 100 : 0;
    const ctor = opens > 0 ? (clicks / opens) * 100 : 0;

    return {
      data: [
        {
          x: ['Open Rate', 'Click Rate', 'CTOR'],
          y: [openRate, clickRate, ctor],
          type: 'bar' as const,
          marker: {
            color: ['hsl(221, 83%, 53%)', 'hsl(262, 83%, 58%)', 'hsl(199, 89%, 48%)'],
          },
        },
      ],
      layout: {
        title: { text: 'Engagement Metrics (%)' },
        yaxis: { title: { text: 'Percentage' } },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'inherit' },
      },
    };
  }, [data]);

  // Email Funnel Chart
  const funnelData = useMemo(() => {
    const totalSent = data.reduce((sum, item) => sum + item.total_sent, 0);
    const delivered = data.reduce((sum, item) => sum + item.delivered, 0);
    const opens = data.reduce((sum, item) => sum + item.opens, 0);
    const clicks = data.reduce((sum, item) => sum + item.clicks, 0);

    return {
      data: [
        {
          type: 'funnel' as const,
          y: ['Sent', 'Delivered', 'Opened', 'Clicked'],
          x: [totalSent, delivered, opens, clicks],
          marker: {
            color: [
              'hsl(221, 83%, 53%)',
              'hsl(142, 76%, 36%)',
              'hsl(262, 83%, 58%)',
              'hsl(199, 89%, 48%)',
            ],
          },
        },
      ],
      layout: {
        title: { text: 'Email Funnel' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'inherit' },
      },
    };
  }, [data]);

  const chartConfig: any = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 shadow-card">
        <Plot
          data={opensClicksData.data}
          layout={{ ...opensClicksData.layout, autosize: true }}
          config={chartConfig}
          useResizeHandler
          className="w-full h-full"
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      <Card className="p-6 shadow-card">
        <Plot
          data={deliveryBouncesData.data}
          layout={{ ...deliveryBouncesData.layout, autosize: true }}
          config={chartConfig}
          useResizeHandler
          className="w-full h-full"
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      <Card className="p-6 shadow-card">
        <Plot
          data={engagementData.data}
          layout={{ ...engagementData.layout, autosize: true }}
          config={chartConfig}
          useResizeHandler
          className="w-full h-full"
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      <Card className="p-6 shadow-card">
        <Plot
          data={funnelData.data}
          layout={{ ...funnelData.layout, autosize: true }}
          config={chartConfig}
          useResizeHandler
          className="w-full h-full"
          style={{ width: '100%', height: '400px' }}
        />
      </Card>
    </div>
  );
};

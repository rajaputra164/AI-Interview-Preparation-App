import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ScoreChartProps {
  labels: string[];
  values: number[];
}

export function ScoreChart({ labels, values }: ScoreChartProps) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: 'Performance',
            data: values,
            borderColor: '#2fc891',
            backgroundColor: 'rgba(47, 200, 145, 0.16)',
            tension: 0.35,
            fill: true
          }
        ]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#ecfdf5'
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#a8b3c7' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y: {
            ticks: { color: '#a8b3c7' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          }
        }
      }}
    />
  );
}
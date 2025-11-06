import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AlgorithmResult {
  name: string;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  totalTime: number;
  cpuUtilization: number;
}

interface ComparisonChartsProps {
  results: AlgorithmResult[];
  isDarkMode: boolean;
}

const ComparisonCharts = ({ results, isDarkMode }: ComparisonChartsProps) => {
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const textColor = isDarkMode ? '#cbd5e1' : '#475569';
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';

  const metricsData = results.map((result) => ({
    name: result.name,
    'Avg Waiting': Number(result.avgWaitingTime),
    'Avg Turnaround': Number(result.avgTurnaroundTime),
    'Total Time': Number(result.totalTime),
    'CPU Util %': Number(result.cpuUtilization),
  }));

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Waiting Time Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} tickFormatter={(v) => v.toFixed(2)} />
            <Tooltip
              contentStyle={{ backgroundColor, borderColor: gridColor }}
              labelStyle={{ color: textColor }}
              formatter={(value: any) => [Number(value).toFixed(2), 'Avg Waiting']}
            />
            <Legend />
            <Bar dataKey="Avg Waiting" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Turnaround Time Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} tickFormatter={(v) => v.toFixed(2)} />
            <Tooltip
              contentStyle={{ backgroundColor, borderColor: gridColor }}
              labelStyle={{ color: textColor }}
              formatter={(value: any) => [Number(value).toFixed(2), 'Avg Turnaround']}
            />
            <Legend />
            <Bar dataKey="Avg Turnaround" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Algorithm Performance Metrics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} tickFormatter={(v) => v.toFixed(2)} />
            <Tooltip
              contentStyle={{ backgroundColor, borderColor: gridColor }}
              labelStyle={{ color: textColor }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Avg Waiting"
              stroke="#3b82f6"
              strokeWidth={2}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="Avg Turnaround"
              stroke="#8b5cf6"
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Removed Total Time vs CPU Utilization chart per request */}

      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Summary Table
        </h3>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <thead>
              <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-300'}>
                <th className="px-4 py-2 text-left font-semibold">Algorithm</th>
                <th className="px-4 py-2 text-center font-semibold">Avg Waiting</th>
                <th className="px-4 py-2 text-center font-semibold">Avg Turnaround</th>
                <th className="px-4 py-2 text-center font-semibold">Total Time</th>
                <th className="px-4 py-2 text-center font-semibold">CPU Util %</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr
                  key={idx}
                  className={isDarkMode ? 'border-b border-slate-700 hover:bg-slate-700/30' : 'border-b border-slate-300 hover:bg-slate-200'}
                >
                  <td className="px-4 py-2 font-semibold">{result.name}</td>
                  <td className="px-4 py-2 text-center">{result.avgWaitingTime.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{result.avgTurnaroundTime.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{result.totalTime}</td>
                  <td className="px-4 py-2 text-center">{result.cpuUtilization.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCharts;

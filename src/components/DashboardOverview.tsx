import { BarChart3, Zap, Activity, TrendingUp } from 'lucide-react';

interface DashboardOverviewProps {
  isDarkMode: boolean;
}

const DashboardOverview = ({ isDarkMode }: DashboardOverviewProps) => {
  const bgColor = isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-slate-300';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Deadlock Detection',
      description: 'Banker\'s Algorithm with resource allocation graphs and circular wait detection',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'CPU Scheduling',
      description: 'FCFS, SJF, LJF, Priority, and Round Robin with animated Gantt charts',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Visual Analytics',
      description: 'Interactive comparison charts and performance metrics across all algorithms',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Real-time Simulation',
      description: 'Step-by-step animation with play/pause controls and variable speed',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
      <h2 className={`text-3xl font-bold ${textColor} mb-8 text-center`}>
        Advanced OS Simulator Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg border ${borderColor} hover:shadow-lg transition-all duration-300`}
          >
            <div className={`flex items-center gap-3 mb-3`}>
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className={`text-lg font-semibold ${textColor}`}>
                {feature.title}
              </h3>
            </div>
            <p className={`${mutedColor} text-sm`}>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
          <div className={`text-2xl font-bold text-blue-400 mb-1`}>5+</div>
          <div className={`${mutedColor} text-sm`}>Scheduling Algorithms</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className={`text-2xl font-bold text-purple-400 mb-1`}>100%</div>
          <div className={`${mutedColor} text-sm`}>Interactive & Real-time</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <div className={`text-2xl font-bold text-green-400 mb-1`}>Live</div>
          <div className={`${mutedColor} text-sm`}>Export Results (JSON)</div>
        </div>
      </div>

      <div className={`mt-8 p-6 rounded-lg bg-gradient-to-r from-slate-900/50 to-slate-800/50 border ${borderColor}`}>
        <h4 className={`text-lg font-semibold ${textColor} mb-4`}>Key Features:</h4>
        <ul className={`space-y-2 ${mutedColor} text-sm`}>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            Multiple safe sequences with optimal sequence detection
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Resource allocation graph with circular wait visualization
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Animated step-by-step simulation with play/pause controls
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Comprehensive performance metrics and comparisons
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            Dark/Light theme support with responsive design
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Export simulation results as JSON for documentation
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverview;

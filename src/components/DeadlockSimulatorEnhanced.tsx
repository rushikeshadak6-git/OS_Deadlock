import { useState } from 'react';
import { RefreshCw, Play, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { detectDeadlock, SafeSequence } from '../utils/bankersAlgorithm';
import ResourceAllocationGraph from './ResourceAllocationGraph';

interface ProcessData {
  allocation: number[];
  max: number[];
}

interface DeadlockSimulatorEnhancedProps {
  isDarkMode: boolean;
}

const DeadlockSimulatorEnhanced = ({ isDarkMode }: DeadlockSimulatorEnhancedProps) => {
  const [numProcesses, setNumProcesses] = useState(5);
  const [numResources, setNumResources] = useState(3);
  const [available, setAvailable] = useState<number[]>([3, 3, 2]);
  const [processes, setProcesses] = useState<ProcessData[]>([
    { allocation: [0, 1, 0], max: [7, 5, 3] },
    { allocation: [2, 0, 0], max: [3, 2, 2] },
    { allocation: [3, 0, 2], max: [9, 0, 2] },
    { allocation: [2, 1, 1], max: [2, 2, 2] },
    { allocation: [0, 0, 2], max: [4, 3, 3] },
  ]);
  const [result, setResult] = useState<{
    isSafe: boolean;
    safeSequences: SafeSequence[];
    optimalSequence: SafeSequence | null;
  } | null>(null);

  const bgColor = isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-slate-300';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-blue-200' : 'text-blue-700';
  const inputBg = isDarkMode ? 'bg-slate-700' : 'bg-slate-200';
  const inputText = isDarkMode ? 'text-white' : 'text-slate-900';

  const randomizeData = () => {
    const newAvailable = Array.from({ length: numResources }, () =>
      Math.floor(Math.random() * 5 + 2)
    );
    const newProcesses = Array.from({ length: numProcesses }, () => {
      const allocation = Array.from({ length: numResources }, () =>
        Math.floor(Math.random() * 3)
      );
      const max = allocation.map((val) => val + Math.floor(Math.random() * 4 + 1));
      return { allocation, max };
    });
    setAvailable(newAvailable);
    setProcesses(newProcesses);
    setResult(null);
  };

  const handleDetectDeadlock = () => {
    const detectionResult = detectDeadlock(processes, available);
    setResult(detectionResult);
  };

  const updateProcessValue = (
    processIndex: number,
    type: 'allocation' | 'max',
    resourceIndex: number,
    value: string
  ) => {
    const newProcesses = [...processes];
    const numValue = parseInt(value) || 0;
    newProcesses[processIndex][type][resourceIndex] = numValue;
    setProcesses(newProcesses);
    setResult(null);
  };

  const updateAvailable = (resourceIndex: number, value: string) => {
    const newAvailable = [...available];
    newAvailable[resourceIndex] = parseInt(value) || 0;
    setAvailable(newAvailable);
    setResult(null);
  };

  const handleDimensionChange = (newProc: number, newRes: number) => {
    setNumProcesses(newProc);
    setNumResources(newRes);
    setAvailable(Array(newRes).fill(3));
    setProcesses(
      Array.from({ length: newProc }, () => ({
        allocation: Array(newRes).fill(0),
        max: Array(newRes).fill(5),
      }))
    );
    setResult(null);
  };

  const exportResults = () => {
    if (!result) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      configuration: {
        numProcesses,
        numResources,
        available,
        processes,
      },
      results: {
        isSafe: result.isSafe,
        optimalSequence: result.optimalSequence,
        allSafeSequences: result.safeSequences,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deadlock-analysis-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
        <h2 className={`text-2xl font-bold ${textColor} mb-4`}>Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`block ${labelColor} mb-2 font-semibold`}>Number of Processes</label>
            <input
              type="number"
              min="2"
              max="10"
              value={numProcesses}
              onChange={(e) =>
                handleDimensionChange(parseInt(e.target.value) || 2, numResources)
              }
              className={`w-full px-4 py-2 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div>
            <label className={`block ${labelColor} mb-2 font-semibold`}>Number of Resources</label>
            <input
              type="number"
              min="2"
              max="5"
              value={numResources}
              onChange={(e) =>
                handleDimensionChange(numProcesses, parseInt(e.target.value) || 2)
              }
              className={`w-full px-4 py-2 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className={`block ${labelColor} mb-2 font-semibold`}>Available Resources</label>
          <div className="flex gap-2 flex-wrap">
            {available.map((val, idx) => (
              <input
                key={idx}
                type="number"
                min="0"
                value={val}
                onChange={(e) => updateAvailable(idx, e.target.value)}
                className={`w-20 px-3 py-2 ${inputBg} ${inputText} rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={randomizeData}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Randomize
          </button>
          <button
            onClick={handleDetectDeadlock}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            Detect
          </button>
          {result && (
            <button
              onClick={exportResults}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${result.isSafe ? 'border-green-500' : 'border-red-500'}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            {result.isSafe ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span className={textColor}>System is in Safe State</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <span className={textColor}>Deadlock Detected!</span>
              </>
            )}
          </h3>
          <ResourceAllocationGraph
            processes={processes.map((p, idx) => ({
              id: idx,
              allocated: p.allocation,
              requested: p.max.map((max, i) => Math.max(0, max - p.allocation[i])),
            }))}
            resources={available}
            isDarkMode={isDarkMode}
            hasDeadlock={!result.isSafe}
          />
        </div>
      )}

      <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
        <h2 className={`text-2xl font-bold ${textColor} mb-4`}>Process Data</h2>
        <div className="overflow-x-auto">
          <table className={`w-full ${textColor}`}>
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className="px-4 py-3 text-left">Process</th>
                <th className="px-4 py-3 text-left">Allocation</th>
                <th className="px-4 py-3 text-left">Maximum</th>
                <th className="px-4 py-3 text-left">Need</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc, pIdx) => (
                <tr key={pIdx} className={`border-b ${borderColor} hover:${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-200/30'}`}>
                  <td className="px-4 py-3 font-semibold text-blue-300">P{pIdx}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {proc.allocation.map((val, rIdx) => (
                        <input
                          key={rIdx}
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) =>
                            updateProcessValue(pIdx, 'allocation', rIdx, e.target.value)
                          }
                          className={`w-16 px-2 py-1 ${inputBg} ${inputText} rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {proc.max.map((val, rIdx) => (
                        <input
                          key={rIdx}
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) =>
                            updateProcessValue(pIdx, 'max', rIdx, e.target.value)
                          }
                          className={`w-16 px-2 py-1 ${inputBg} ${inputText} rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {proc.max.map((maxVal, rIdx) => (
                        <div
                          key={rIdx}
                          className={`w-16 px-2 py-1 ${isDarkMode ? 'bg-slate-900 text-cyan-300' : 'bg-slate-300 text-cyan-700'} rounded text-center`}
                        >
                          {maxVal - proc.allocation[rIdx]}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {result && result.isSafe && result.safeSequences.length > 0 && (
        <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold ${textColor} mb-4`}>
            All Safe Sequences: {result.safeSequences.length}
          </h2>
          <div className="space-y-4">
            {result.safeSequences.slice(0, 5).map((seq, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  result.optimalSequence && seq === result.optimalSequence
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400'
                      : 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-600'
                    : isDarkMode
                    ? 'bg-slate-700/50'
                    : 'bg-slate-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold ${textColor}`}>Sequence {idx + 1}:</span>
                    <div className="flex gap-1 flex-wrap">
                      {seq.sequence.map((p, i) => (
                        <span key={i}>
                          <span className="px-2 py-1 bg-blue-500 text-white rounded text-sm font-semibold">
                            P{p}
                          </span>
                          {i < seq.sequence.length - 1 && (
                            <span className="mx-1 text-blue-300">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  {result.optimalSequence && seq === result.optimalSequence && (
                    <span className="px-3 py-1 bg-yellow-400 text-slate-900 rounded-lg font-bold text-sm">
                      OPTIMAL
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                  <div className={isDarkMode ? 'bg-slate-800 p-2' : 'bg-slate-300 p-2'} style={{ borderRadius: '0.375rem' }}>
                    <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Total Time</div>
                    <div className={`${textColor} font-bold`}>{seq.totalTime}</div>
                  </div>
                  <div className={isDarkMode ? 'bg-slate-800 p-2' : 'bg-slate-300 p-2'} style={{ borderRadius: '0.375rem' }}>
                    <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Avg Waiting</div>
                    <div className={`${textColor} font-bold`}>{seq.avgWaitingTime.toFixed(2)}</div>
                  </div>
                  <div className={isDarkMode ? 'bg-slate-800 p-2' : 'bg-slate-300 p-2'} style={{ borderRadius: '0.375rem' }}>
                    <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Avg Burst</div>
                    <div className={`${textColor} font-bold`}>{seq.avgBurstTime.toFixed(2)}</div>
                  </div>
                  <div className={isDarkMode ? 'bg-slate-800 p-2' : 'bg-slate-300 p-2'} style={{ borderRadius: '0.375rem' }}>
                    <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-xs`}>Avg TAT</div>
                    <div className={`${textColor} font-bold`}>{seq.avgTurnaroundTime.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
            {result.safeSequences.length > 5 && (
              <p className={`text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                ... and {result.safeSequences.length - 5} more sequences
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlockSimulatorEnhanced;

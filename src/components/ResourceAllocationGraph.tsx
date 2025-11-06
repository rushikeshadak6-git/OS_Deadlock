import { useEffect, useRef } from 'react';

interface Process {
  id: number;
  allocated: number[];
  requested: number[];
}

interface ResourceNode {
  id: string;
  type: 'process' | 'resource';
  x: number;
  y: number;
  radius: number;
}

interface Edge {
  from: string;
  to: string;
  type: 'allocation' | 'request';
}

interface ResourceAllocationGraphProps {
  processes: Process[];
  resources: number[];
  isDarkMode: boolean;
  hasDeadlock: boolean;
  highlightedProcesses?: number[];
}

const ResourceAllocationGraph = ({
  processes,
  resources,
  isDarkMode,
  hasDeadlock,
  highlightedProcesses = [],
}: ResourceAllocationGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = isDarkMode ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const nodes: ResourceNode[] = [];
    const processCount = processes.length;
    const resourceCount = resources.length;

    const processRadius = 25;
    const resourceRadius = 28; // make resource squares slightly smaller

    for (let i = 0; i < processCount; i++) {
      const angle = (i / processCount) * Math.PI * 2;
      nodes.push({
        id: `P${i}`,
        type: 'process',
        x: width / 2 + Math.cos(angle) * (height / 3),
        y: height / 2 + Math.sin(angle) * (height / 3),
        radius: processRadius,
      });
    }

    for (let i = 0; i < resourceCount; i++) {
      const angle = (i / resourceCount) * Math.PI * 2 + Math.PI / resourceCount;
      nodes.push({
        id: `R${i}`,
        type: 'resource',
        x: width / 2 + Math.cos(angle) * (height / 2.0), // place a bit farther than processes
        y: height / 2 + Math.sin(angle) * (height / 2.0),
        radius: resourceRadius,
      });
    }

    const edges: Edge[] = [];
    processes.forEach((proc, idx) => {
      resources.forEach((_, resIdx) => {
        if (proc.allocated[resIdx] > 0) {
          edges.push({ from: `P${idx}`, to: `R${resIdx}`, type: 'allocation' });
        }
        if (proc.requested[resIdx] > 0) {
          edges.push({ from: `R${resIdx}`, to: `P${idx}`, type: 'request' });
        }
      });
    });

    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);

      if (fromNode && toNode) {
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const startX = fromNode.x + (dx / dist) * fromNode.radius;
        const startY = fromNode.y + (dy / dist) * fromNode.radius;
        const endX = toNode.x - (dx / dist) * toNode.radius;
        const endY = toNode.y - (dy / dist) * toNode.radius;

        ctx.strokeStyle =
          edge.type === 'allocation'
            ? isDarkMode
              ? '#10b981'
              : '#059669'
            : isDarkMode
            ? '#f59e0b'
            : '#d97706';
        ctx.lineWidth = 2;
        ctx.setLineDash(edge.type === 'allocation' ? [] : [5, 5]);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        const headlen = 15;
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.fillStyle = edge.type === 'allocation' ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }
    });

    nodes.forEach((node) => {
      if (node.type === 'process') {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        const pid = parseInt(node.id.slice(1));
        const isHighlighted = highlightedProcesses.includes(pid);
        ctx.fillStyle = isHighlighted ? '#facc15' : isDarkMode ? '#3b82f6' : '#2563eb';
        ctx.fill();
        ctx.strokeStyle = isHighlighted ? '#f59e0b' : hasDeadlock ? '#ef4444' : '#60a5fa';
        ctx.lineWidth = isHighlighted ? 5 : 3;
        if (isHighlighted) {
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 20;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = isDarkMode ? '#ffffff' : '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      } else {
        // Draw resource as a red square
        const size = node.radius * 2;
        const x = node.x - node.radius;
        const y = node.y - node.radius;
        ctx.fillStyle = '#ef4444'; // red fill
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#b91c1c'; // darker red border
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, size, size);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      }
    });

    if (hasDeadlock) {
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('DEADLOCK DETECTED: Circular Wait Found!', width / 2, 30);
    }
  }, [processes, resources, isDarkMode, hasDeadlock]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-96 rounded-lg border-2 ${
        hasDeadlock ? 'border-red-500' : isDarkMode ? 'border-slate-700' : 'border-slate-300'
      }`}
    />
  );
};

export default ResourceAllocationGraph;

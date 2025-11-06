# Quick Start Guide - OS Simulator

## Getting Started in 30 Seconds

### 1. Launch the Application
The simulator is ready to run. When you start it, you'll see three main sections:

```
┌─────────────────────────────────────────┐
│    OS Process & Deadlock Simulator      │
│  [☀️/🌙 Theme Toggle] [Overview] [🛡️ Deadlock] [⏱️ Scheduling]  │
└─────────────────────────────────────────┘
```

---

## Deadlock Detection Tutorial

### Basic Workflow:

```
1. Click "Deadlock Detection" tab
   └─ See process data and resource configuration

2. Choose Configuration:
   Option A: Click "Randomize" for sample data
   Option B: Manually adjust process/resource values

3. Click "Detect" button
   └─ System analyzes all safe sequences

4. Review Results:
   - See if system is in safe state
   - View resource allocation graph
   - Review all safe sequences found
   - Identify optimal sequence (lowest total time)

5. Export (Optional):
   - Click "Export" button
   - JSON file downloads with results
```

### What You'll See:

**Safe State** (Green checkmark):
- All safe sequences displayed
- Resource allocation graph
- "OPTIMAL" badge on best sequence
- Can proceed safely

**Deadlock** (Red alert):
- Warning: "DEADLOCK DETECTED"
- Graph shows circular wait in red
- No safe sequences available

---

## CPU Scheduling Tutorial

### Basic Workflow:

```
1. Click "CPU Scheduling" tab
   └─ See scheduling algorithms

2. Select Algorithm:
   - FCFS (First Come First Served)
   - SJF (Shortest Job First)
   - LJF (Longest Job First)
   - Priority Scheduling
   - Round Robin (with quantum)

3. Configure Processes:
   - Click "Add Process" to add more
   - Edit Arrival Time, Burst Time, Priority
   - Click "Randomize" for test data
   - Remove processes as needed

4. Run Simulation:
   - Click "Run [Algorithm]"
   - Watch animated Gantt chart
   - Play/Pause/Step through execution
   - Adjust speed (0.5x, 1x, 1.5x, 2x)

5. View Results:
   - Gantt chart shows process order
   - Metrics cards show averages
   - Details table shows per-process stats

6. Compare All:
   - Click "Compare All" to run all algorithms
   - See interactive comparison charts
   - Identify best algorithm for workload
```

### Animated Controls Explained:

```
┌─ Play/Pause: Start/Stop simulation
├─ Step Back: Go one process back
├─ Step Forward: Go one process forward
├─ Reset: Return to beginning
└─ Speed: 0.5x (slow) to 2x (fast)
```

---

## Metric Definitions

### Scheduling Metrics:

| Term | Definition | Good When |
|------|-----------|-----------|
| **Arrival Time (AT)** | When process enters system | --- |
| **Burst Time (BT)** | CPU time needed | Given as input |
| **Start Time (ST)** | When process starts execution | ASAP |
| **Completion Time (CT)** | When process finishes | ASAP |
| **Waiting Time (WT)** | Time in ready queue (CT - AT - BT) | Low |
| **Turnaround Time (TAT)** | Total time in system (CT - AT) | Low |
| **Avg Waiting Time** | Average WT across all processes | Low |
| **Avg Turnaround** | Average TAT across all processes | Low |

### Deadlock Metrics:

| Metric | Meaning |
|--------|---------|
| **Total Time** | Sum of all burst times for sequence |
| **Avg Burst Time** | Average resource hold time |
| **Avg Waiting** | Average process wait time |
| **Avg Turnaround** | Average TAT in sequence |

---

## Common Scenarios

### Scenario 1: Compare Algorithm Efficiency
```
Goal: Find best scheduling for given workload

Steps:
1. Go to "CPU Scheduling"
2. Create representative process mix
3. Click "Compare All"
4. Review comparison charts
5. Identify algorithm with lowest avg waiting time
```

### Scenario 2: Test Deadlock Safety
```
Goal: Verify if system is deadlock-free

Steps:
1. Go to "Deadlock Detection"
2. Input processes and resources
3. Click "Detect"
4. If green → System is safe
5. If red → Deadlock conditions exist
```

### Scenario 3: Optimize Round Robin Quantum
```
Goal: Find best time quantum for Round Robin

Steps:
1. Go to "CPU Scheduling"
2. Select "Round Robin"
3. Try different quantum values (2, 4, 8)
4. Run simulation for each
5. Compare results
6. Choose lowest avg waiting time
```

---

## Tips & Tricks

### 💡 Pro Tips:

1. **Randomize Often**: Click "Randomize" to test with different data
2. **Compare Algorithms**: Use "Compare All" to find optimal algorithm
3. **Step Through**: Use Step controls to understand process order
4. **Export Results**: Save JSON for documentation/reports
5. **Try Both Modes**: Test both dark and light themes
6. **Mobile Friendly**: Works on tablets and phones too

### ⚠️ Important Notes:

- **Priority Scheduling**: Lower number = higher priority
- **Round Robin**: Smaller quantum = more context switches
- **Deadlock**: Red graph = circular wait condition
- **Optimal Sequence**: Marked with YELLOW "OPTIMAL" badge

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Theme | Sun/Moon button in top right |
| Export | Click "Export" after simulation |
| Pause | Space key during animation |
| Reset | Esc or click reset button |

---

## Troubleshooting

### Chart Not Showing?
- Ensure browser JavaScript is enabled
- Try refreshing page
- Check browser compatibility (Chrome 90+, Firefox 88+)

### Export Not Working?
- Check browser download settings
- Ensure pop-ups aren't blocked
- Try different browser

### Animation Too Fast?
- Click "Speed" dropdown
- Select 0.5x or 1x

### Theme Not Changing?
- Click sun/moon icon in header
- Page should transition smoothly

---

## Integration with Studies

### For College Projects:
1. Run simulation with class example
2. Export results as JSON
3. Include in documentation
4. Show graphs and metrics
5. Explain algorithm choice

### For Research:
1. Configure realistic process data
2. Compare multiple algorithms
3. Analyze performance metrics
4. Export complete results
5. Document findings

### For Learning:
1. Start with FCFS (simplest)
2. Progress to SJF (shows optimization)
3. Try Priority (shows preemption)
4. Test Round Robin (shows fairness)
5. Explore Deadlock (shows safety)

---

## Next Steps

1. **Explore Overview Tab**
   - Read feature descriptions
   - Understand capabilities

2. **Try Deadlock Detection**
   - Randomize some data
   - Click Detect
   - Review results
   - Export JSON

3. **Try All Scheduling Algorithms**
   - Run each one individually
   - Compare all at once
   - Identify patterns

4. **Export & Document**
   - Run your final simulation
   - Click Export
   - Save for project
   - Include in report

---

## Support & Resources

### Built With:
- React 18 + TypeScript
- Tailwind CSS
- Recharts for visualization
- Canvas for resource graphs

### Perfect For:
- Operating Systems courses
- Algorithm education
- Performance analysis
- System design learning

---

**Ready to simulate? Click any tab above to get started!**

For detailed feature documentation, see FEATURES.md
For complete build info, see BUILD_SUMMARY.md

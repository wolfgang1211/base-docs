import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type Scenario = {
  id: string;
  label: string;
  summary: string;
  samples: Array<{ label: string; value: number }>;
  statLabel: string;
  statValue: string;
};

const scenarios: Scenario[] = [
  {
    id: 'baseline',
    label: 'Baseline load',
    summary: 'Steady transaction flow with typical daytime usage patterns.',
    statLabel: 'Median throughput',
    statValue: '2.4M gas / block',
    samples: [
      { label: '00:00', value: 1.5 },
      { label: '04:00', value: 1.8 },
      { label: '08:00', value: 2.2 },
      { label: '12:00', value: 2.7 },
      { label: '16:00', value: 2.5 },
      { label: '20:00', value: 2.1 },
    ],
  },
  {
    id: 'surge',
    label: 'Blob surge',
    summary: 'A short-lived demand spike that stresses batch posting and fees.',
    statLabel: 'Peak throughput',
    statValue: '4.1M gas / block',
    samples: [
      { label: '00:00', value: 1.6 },
      { label: '04:00', value: 1.9 },
      { label: '08:00', value: 2.8 },
      { label: '12:00', value: 4.1 },
      { label: '16:00', value: 3.6 },
      { label: '20:00', value: 2.4 },
    ],
  },
  {
    id: 'tuned',
    label: 'Tuned batching',
    summary: 'The same traffic after batching and submission policies are tuned.',
    statLabel: 'Fee reduction',
    statValue: '18% lower blob spend',
    samples: [
      { label: '00:00', value: 1.5 },
      { label: '04:00', value: 1.8 },
      { label: '08:00', value: 2.6 },
      { label: '12:00', value: 3.3 },
      { label: '16:00', value: 3.0 },
      { label: '20:00', value: 2.2 },
    ],
  },
];

const chartHeight = 220;
const chartWidth = 640;
const paddingX = 40;
const paddingY = 24;

export default function ThroughputExplorer() {
  const [scenarioId, setScenarioId] = useState<Scenario['id']>('baseline');
  const scenario = scenarios.find((entry) => entry.id === scenarioId) ?? scenarios[0];

  const maxValue = useMemo(() => {
    return Math.max(...scenario.samples.map((sample) => sample.value), 4.5);
  }, [scenario.samples]);

  const points = useMemo(() => {
    const usableWidth = chartWidth - paddingX * 2;
    const usableHeight = chartHeight - paddingY * 2;

    return scenario.samples
      .map((sample, index) => {
        const x = paddingX + (usableWidth / (scenario.samples.length - 1)) * index;
        const y = chartHeight - paddingY - (sample.value / maxValue) * usableHeight;
        return `${x},${y}`;
      })
      .join(' ');
  }, [maxValue, scenario.samples]);

  return (
    <section style={styles.frame}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Interactive graph</p>
          <h3 style={styles.title}>Throughput explorer</h3>
          <p style={styles.summary}>{scenario.summary}</p>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>{scenario.statLabel}</span>
          <strong style={styles.statValue}>{scenario.statValue}</strong>
        </div>
      </div>

      <div style={styles.buttonRow}>
        {scenarios.map((entry) => {
          const active = entry.id === scenario.id;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setScenarioId(entry.id)}
              style={{
                ...styles.button,
                ...(active ? styles.buttonActive : null),
              }}
            >
              {entry.label}
            </button>
          );
        })}
      </div>

      <div style={styles.chartShell}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={styles.chart} role="img" aria-label="Throughput line chart">
          {[0, 1, 2, 3, 4].map((step) => {
            const y = chartHeight - paddingY - ((step + 1) / 5) * (chartHeight - paddingY * 2);
            return (
              <g key={step}>
                <line x1={paddingX} x2={chartWidth - paddingX} y1={y} y2={y} stroke="rgba(16, 32, 63, 0.12)" />
                <text x={10} y={y + 4} fill="#5d6b85" fontSize="12">
                  {((maxValue / 5) * (5 - step)).toFixed(1)}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            stroke="#0052ff"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />

          {scenario.samples.map((sample, index) => {
            const usableWidth = chartWidth - paddingX * 2;
            const usableHeight = chartHeight - paddingY * 2;
            const x = paddingX + (usableWidth / (scenario.samples.length - 1)) * index;
            const y = chartHeight - paddingY - (sample.value / maxValue) * usableHeight;

            return (
              <g key={sample.label}>
                <circle cx={x} cy={y} r={6} fill="#ffffff" stroke="#0052ff" strokeWidth="3" />
                <text x={x} y={chartHeight - 6} textAnchor="middle" fill="#5d6b85" fontSize="12">
                  {sample.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  frame: {
    margin: '28px 0',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid rgba(16, 32, 63, 0.12)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(238,244,255,0.92))',
    boxShadow: '0 22px 48px rgba(0, 41, 122, 0.12)',
  },
  header: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#0052ff',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    fontSize: '1.6rem',
    letterSpacing: '-0.04em',
  },
  summary: {
    margin: '10px 0 0',
    maxWidth: '48ch',
    color: '#5d6b85',
  },
  statCard: {
    minWidth: '180px',
    padding: '16px 18px',
    borderRadius: '18px',
    background: '#0f1729',
    color: '#edf4ff',
  },
  statLabel: {
    display: 'block',
    color: '#9eb4d8',
    fontSize: '0.82rem',
  },
  statValue: {
    display: 'block',
    marginTop: '6px',
    fontSize: '1.22rem',
    letterSpacing: '-0.04em',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '18px',
  },
  button: {
    appearance: 'none',
    border: '1px solid rgba(16, 32, 63, 0.12)',
    background: 'rgba(255,255,255,0.74)',
    color: '#243556',
    borderRadius: '999px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  buttonActive: {
    border: '1px solid #0052ff',
    background: '#0052ff',
    color: '#ffffff',
    boxShadow: '0 12px 24px rgba(0, 82, 255, 0.24)',
  },
  chartShell: {
    marginTop: '20px',
    overflowX: 'auto',
  },
  chart: {
    width: '100%',
    minWidth: '640px',
    display: 'block',
  },
};

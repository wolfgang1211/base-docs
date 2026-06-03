import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type Policy = {
  id: string;
  label: string;
  steps: Array<{ name: string; duration: number; note: string }>;
};

const policies: Policy[] = [
  {
    id: 'optimistic',
    label: 'Optimistic path',
    steps: [
      { name: 'Sequencer inclusion', duration: 2, note: 'User sees inclusion almost immediately.' },
      { name: 'Batch posted to L1', duration: 8, note: 'Data becomes available for downstream verification.' },
      { name: 'Indexer catch-up', duration: 5, note: 'Infra reads and republishes state for apps.' },
    ],
  },
  {
    id: 'conservative',
    label: 'Conservative app threshold',
    steps: [
      { name: 'Sequencer inclusion', duration: 2, note: 'The transaction lands in a local view.' },
      { name: 'L1 confirmation buffer', duration: 14, note: 'The app waits for stronger confidence before acting.' },
      { name: 'State fan-out', duration: 6, note: 'Internal services recompute derived state and caches.' },
    ],
  },
];

export default function FinalityStepper() {
  const [policyId, setPolicyId] = useState<Policy['id']>('optimistic');
  const policy = policies.find((entry) => entry.id === policyId) ?? policies[0];

  const total = useMemo(
    () => policy.steps.reduce((sum, step) => sum + step.duration, 0),
    [policy.steps],
  );

  return (
    <section style={styles.frame}>
      <div style={styles.topRow}>
        <div>
          <p style={styles.eyebrow}>Interactive widget</p>
          <h3 style={styles.title}>Finality budget explorer</h3>
        </div>

        <div style={styles.buttonRow}>
          {policies.map((entry) => {
            const active = entry.id === policy.id;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setPolicyId(entry.id)}
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
      </div>

      <p style={styles.copy}>
        Click a rollout policy to see how the perceived confirmation time changes across the stack.
      </p>

      <div style={styles.timeline}>
        {policy.steps.map((step) => (
          <div key={step.name} style={styles.stepCard}>
            <div style={styles.stepDuration}>{step.duration}s</div>
            <strong style={styles.stepName}>{step.name}</strong>
            <p style={styles.stepNote}>{step.note}</p>
          </div>
        ))}
      </div>

      <div style={styles.totalBar}>
        <span>Total app-visible confirmation window</span>
        <strong>{total}s</strong>
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
    background: 'rgba(255,255,255,0.9)',
    boxShadow: '0 22px 48px rgba(0, 41, 122, 0.1)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'space-between',
    gap: '16px',
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
    fontSize: '1.55rem',
    letterSpacing: '-0.04em',
  },
  copy: {
    margin: '12px 0 18px',
    color: '#5d6b85',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  button: {
    appearance: 'none',
    border: '1px solid rgba(16, 32, 63, 0.12)',
    background: '#f6f9ff',
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
  },
  timeline: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  stepCard: {
    padding: '16px',
    borderRadius: '18px',
    background: 'linear-gradient(180deg, #f9fbff, #eef4ff)',
    border: '1px solid rgba(0, 82, 255, 0.1)',
  },
  stepDuration: {
    display: 'inline-flex',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#0f1729',
    color: '#edf4ff',
    fontSize: '0.82rem',
    fontWeight: 700,
  },
  stepName: {
    display: 'block',
    marginTop: '12px',
    fontSize: '1rem',
  },
  stepNote: {
    margin: '8px 0 0',
    color: '#5d6b85',
    fontSize: '0.95rem',
  },
  totalBar: {
    marginTop: '16px',
    padding: '16px 18px',
    borderRadius: '18px',
    background: '#0f1729',
    color: '#edf4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
};

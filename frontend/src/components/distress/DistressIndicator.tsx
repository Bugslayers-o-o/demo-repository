interface Props {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

const levelConfig = {
  low: { color: '#34D399', label: 'Doing okay' },
  medium: { color: '#FBBF24', label: 'Feeling heavy' },
  high: { color: '#FB923C', label: 'Needs support' },
  critical: { color: '#F87171', label: 'Reach out' },
};

export default function DistressIndicator({ score, level }: Props) {
  const cfg = levelConfig[level];
  const isCritical = level === 'critical';

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: cfg.color }}
      />
      <span className="text-[var(--ms-text-muted)]">{cfg.label}</span>
      <span className="text-[var(--ms-text-muted)]">· {score}</span>
    </div>
  );
}

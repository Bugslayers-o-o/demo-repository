interface Props {
  role: 'doctor' | 'therapist' | 'psychiatrist' | 'user';
}

const roleConfig: Record<Props['role'], { label: string; color: string; icon: string }> = {
  doctor: { label: 'Verified Doctor', color: 'bg-blue-500/15 text-blue-200 border-blue-400/40', icon: '🩺' },
  therapist: { label: 'Licensed Therapist', color: 'bg-[rgba(139,92,246,0.18)] text-[var(--ms-violet)] border-[rgba(139,92,246,0.45)]', icon: '🧘' },
  psychiatrist: { label: 'Psychiatrist', color: 'bg-[rgba(45,212,191,0.18)] text-[var(--ms-teal)] border-[rgba(45,212,191,0.45)]', icon: '🔬' },
  user: { label: '', color: '', icon: '' },
};

export default function RoleBadge({ role }: Props) {
  if (role === 'user') return null;
  const cfg = roleConfig[role];
  return (
    <span
      title="Verified Mental Health Professional"
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border ${cfg.color}`}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}


import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{label || "Progression globale"}</span>
      <span className="text-sm font-medium">{progress}% complété</span>
    </div>
    <Progress value={progress} className="h-2" />
  </div>
);


import React from 'react';
import { Slider } from '@/components/ui/slider';
import { formatTime } from './utils';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onProgressChange: (value: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onProgressChange,
}) => {
  return (
    <div className="space-y-2">
      <Slider 
        value={[currentTime]} 
        min={0} 
        max={duration} 
        step={1}
        onValueChange={values => onProgressChange(values[0])}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;

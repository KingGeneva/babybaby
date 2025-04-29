
import React from 'react';
import { Lullaby } from './types';

interface LullabyInfoProps {
  lullaby: Lullaby;
}

const LullabyInfo: React.FC<LullabyInfoProps> = ({ lullaby }) => {
  return (
    <div className="text-center py-4">
      <h3 className="text-lg font-medium">{lullaby.title}</h3>
      <p className="text-sm text-muted-foreground">{lullaby.artist}</p>
    </div>
  );
};

export default LullabyInfo;

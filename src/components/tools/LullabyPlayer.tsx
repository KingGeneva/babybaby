
import React from 'react';
import LullabyContainer from './lullaby/LullabyContainer';

interface LullabyPlayerProps {
  className?: string;
}

const LullabyPlayer: React.FC<LullabyPlayerProps> = ({ className }) => {
  return <LullabyContainer className={className} />;
};

export default LullabyPlayer;

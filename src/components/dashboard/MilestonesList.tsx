
import React from 'react';
import { motion } from 'framer-motion';

interface Milestone {
  name: string;
  age: string;
  achieved: boolean;
}

interface MilestonesListProps {
  milestones: Milestone[];
}

const MilestonesList: React.FC<MilestonesListProps> = ({ milestones }) => {
  return (
    <div className="relative">
      <div className="absolute h-full w-1 bg-babybaby-blue/30 left-3 top-0 rounded-full"></div>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <motion.div 
            key={index}
            className="flex items-start gap-4 ml-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`absolute left-2 w-2.5 h-2.5 rounded-full ${milestone.achieved ? 'bg-green-400' : 'bg-gray-300'}`}></div>
            <div>
              <p className="font-medium">{milestone.name}</p>
              <p className="text-sm text-gray-600">{milestone.age}</p>
            </div>
            {milestone.achieved && (
              <div className="flex-1 text-right">
                <span className="text-green-500 text-xs">✓ Acquis</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MilestonesList;


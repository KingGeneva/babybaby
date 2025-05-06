
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import DiscussionCard, { DiscussionProps } from './DiscussionCard';

interface RecentDiscussionsProps {
  discussions: DiscussionProps[];
}

const RecentDiscussions = ({ discussions }: RecentDiscussionsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Discussions récentes</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/forum" className="flex items-center gap-1">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <DiscussionCard key={discussion.id} discussion={discussion} />
        ))}
      </div>
    </div>
  );
};

export default RecentDiscussions;

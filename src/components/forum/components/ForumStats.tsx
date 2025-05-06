
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ForumStats = () => {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-semibold mb-4">Statistiques</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Membres</span>
            <span className="font-medium">52,489</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-gray-600">Discussions</span>
            <span className="font-medium">8,753</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-gray-600">Commentaires</span>
            <span className="font-medium">124,931</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-gray-600">En ligne</span>
            <span className="font-medium text-green-500">239</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90" asChild>
            <Link to="/forum">
              Rejoindre la discussion
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForumStats;

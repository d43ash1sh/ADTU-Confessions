import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Zap } from 'lucide-react';
import { api, type ApiConfession } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Battles() {
  const [currentBattle, setCurrentBattle] = useState<[ApiConfession, ApiConfession] | null>(null);
  const [battleStats, setBattleStats] = useState({ wins: 0, battles: 0 });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: confessions = [] } = useQuery({
    queryKey: ['/api/confessions'],
    queryFn: () => api.getConfessions(),
  });

  const battleMutation = useMutation({
    mutationFn: ({ winnerId }: { winnerId: string }) => {
      const winner = currentBattle?.find(c => c.id === winnerId);
      if (!winner) throw new Error('Winner not found');
      
      let currentReactions = { love: 0, laugh: 0, fire: 0 };
      try {
        if (winner.reactions) {
          currentReactions = JSON.parse(winner.reactions);
        }
      } catch (e) {
        console.warn('Failed to parse reactions:', e);
      }
      
      const newReactions = { ...currentReactions, fire: (currentReactions.fire || 0) + 1 };
      return api.updateReactions(winnerId, newReactions);
    },
    onSuccess: () => {
      setBattleStats(prev => ({ wins: prev.wins + 1, battles: prev.battles + 1 }));
      generateNewBattle();
      toast({
        title: "Battle Complete! 🔥",
        description: "Your vote has been counted!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/confessions'] });
    },
  });

  const generateNewBattle = () => {
    if (confessions.length < 2) return;
    
    const shuffled = [...confessions].sort(() => Math.random() - 0.5);
    const battle: [ApiConfession, ApiConfession] = [shuffled[0], shuffled[1]];
    setCurrentBattle(battle);
  };

  useEffect(() => {
    if (confessions.length >= 2) {
      generateNewBattle();
    }
  }, [confessions]);

  const handleVote = (winner: ApiConfession) => {
    battleMutation.mutate({ winnerId: winner.id });
  };

  const categoryColors: Record<string, string> = {
    funny: "bg-blue-100 text-blue-800",
    crush: "bg-pink-100 text-pink-800",
    hostel: "bg-green-100 text-green-800",
    sad: "bg-gray-100 text-gray-800",
    roast: "bg-orange-100 text-orange-800",
    academic: "bg-purple-100 text-purple-800",
    friendship: "bg-yellow-100 text-yellow-800",
    other: "bg-gray-100 text-gray-800",
  };

  if (!currentBattle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Flame className="w-16 h-16 mx-auto text-orange-500 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Loading Battle Arena...</h1>
          <p className="text-gray-600">Preparing epic confession battles!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-8 h-8 text-orange-500 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Confession Battles
            </h1>
            <Flame className="w-8 h-8 text-orange-500 ml-2" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Vote for the most relatable confession! 🔥
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">{battleStats.wins} Wins</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">{battleStats.battles} Battles</span>
            </div>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {currentBattle.map((confession, index) => (
            <Card 
              key={confession.id} 
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleVote(confession)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={categoryColors[confession.category] || categoryColors.other}>
                    {confession.category.charAt(0).toUpperCase() + confession.category.slice(1)}
                  </Badge>
                  <Badge variant="outline">#{confession.displayId}</Badge>
                </div>
                
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-6 min-h-[120px]">
                  {confession.text}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    {(() => {
                      let reactions = { love: 0, laugh: 0, fire: 0 };
                      try {
                        if (confession.reactions) {
                          reactions = JSON.parse(confession.reactions);
                        }
                      } catch (e) {
                        console.warn('Failed to parse reactions:', e);
                      }
                      return (
                        <>
                          <span>❤️ {reactions.love || 0}</span>
                          <span>😂 {reactions.laugh || 0}</span>
                          <span>🔥 {reactions.fire || 0}</span>
                        </>
                      );
                    })()}
                  </div>
                  
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={battleMutation.isPending}
                  >
                    Vote This! 🔥
                  </Button>
                </div>
              </CardContent>
              
              {/* Battle indicator */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                VS
              </div>
            </Card>
          ))}
        </div>

        {/* Skip Battle */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={generateNewBattle}
            disabled={battleMutation.isPending}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            Skip Battle ⏭️
          </Button>
        </div>
      </div>
    </div>
  );
}
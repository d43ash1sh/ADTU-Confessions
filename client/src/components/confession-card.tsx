import { useState } from "react";
import { Heart, Laugh, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiConfession, type ReactionData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ConfessionCardProps {
  confession: ApiConfession;
}

const categoryEmojis: Record<string, string> = {
  funny: "😂",
  crush: "💕",
  hostel: "🏠",
  sad: "😢",
  roast: "🔥",
  academic: "📚",
  friendship: "👫",
  other: "💭",
};

const categoryColors: Record<string, string> = {
  funny: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  crush: "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200",
  hostel: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  sad: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200",
  roast: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
  academic: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
  friendship: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  other: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200",
};

export function ConfessionCard({ confession }: ConfessionCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  let reactions: ReactionData;
  try {
    reactions = JSON.parse(confession.reactions);
  } catch {
    reactions = { love: 0, laugh: 0, fire: 0 };
  }

  const [currentReactions, setCurrentReactions] = useState<ReactionData>(reactions);

  const updateReactionsMutation = useMutation({
    mutationFn: (newReactions: ReactionData) => api.updateReactions(confession.id, newReactions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/confessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/confessions/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      });
      setCurrentReactions(reactions); // Revert optimistic update
    },
  });

  const handleReaction = (type: keyof ReactionData) => {
    const newReactions = {
      ...currentReactions,
      [type]: currentReactions[type] + 1,
    };
    
    setCurrentReactions(newReactions); // Optimistic update
    updateReactionsMutation.mutate(newReactions);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const totalReactions = currentReactions.love + currentReactions.laugh + currentReactions.fire;

  return (
    <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1" data-testid={`card-confession-${confession.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-adtu-blue dark:text-blue-400" data-testid={`text-confession-id-${confession.displayId}`}>
              #{confession.displayId?.toString().padStart(3, '0')}
            </span>
            <Badge 
              className={categoryColors[confession.category] || categoryColors.other}
              data-testid={`badge-category-${confession.category}`}
            >
              {categoryEmojis[confession.category]} {confession.category.charAt(0).toUpperCase() + confession.category.slice(1)}
            </Badge>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-date-${confession.id}`}>
            {formatDate(confession.createdAt)}
          </span>
        </div>
        
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4" data-testid={`text-confession-content-${confession.id}`}>
          {confession.text}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('love')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
              disabled={updateReactionsMutation.isPending}
              data-testid={`button-reaction-love-${confession.id}`}
            >
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{currentReactions.love}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('laugh')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors group"
              disabled={updateReactionsMutation.isPending}
              data-testid={`button-reaction-laugh-${confession.id}`}
            >
              <Laugh className="w-4 h-4 group-hover:scale-110 transition-transform text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{currentReactions.laugh}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('fire')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
              disabled={updateReactionsMutation.isPending}
              data-testid={`button-reaction-fire-${confession.id}`}
            >
              <Flame className="w-4 h-4 group-hover:scale-110 transition-transform text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{currentReactions.fire}</span>
            </Button>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500" data-testid={`text-total-reactions-${confession.id}`}>
            {totalReactions} total reactions
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

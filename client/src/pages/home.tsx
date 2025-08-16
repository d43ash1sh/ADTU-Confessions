import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfessionCard } from "@/components/confession-card";
import { api } from "@/lib/api";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  });

  const { data: confessions = [], isLoading: confessionsLoading } = useQuery({
    queryKey: ['/api/confessions', debouncedSearch, category],
    queryFn: () => api.getConfessions(debouncedSearch || undefined, category && category !== 'all' ? category : undefined),
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/confessions/stats'],
    queryFn: () => api.getStats(),
  });

  const categories = [
    { value: "funny", label: "😂 Funny" },
    { value: "crush", label: "💕 Crush" },
    { value: "hostel", label: "🏠 Hostel" },
    { value: "sad", label: "😢 Sad" },
    { value: "roast", label: "🔥 Roast" },
    { value: "academic", label: "📚 Academic" },
    { value: "friendship", label: "👫 Friendship" },
    { value: "other", label: "💭 Other" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          {/* Header with Stats and Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Anonymous Confessions</h2>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span data-testid="text-total-confessions">
                  {stats?.totalConfessions || 0} Total Confessions
                </span>
                <span data-testid="text-total-reactions">
                  {stats?.totalReactions || 0} Total Reactions
                </span>
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search confessions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                  data-testid="input-search"
                />
              </div>
              
              {/* Category Filter */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Confession Feed */}
          <div className="space-y-6">
            {confessionsLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex space-x-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : confessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No confessions found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {search || category ? "Try adjusting your search or filter" : "Be the first to share a confession!"}
                </p>
                <Link href="/submit">
                  <Button className="bg-adtu-blue hover:bg-blue-700" data-testid="button-submit-first">
                    Submit First Confession
                  </Button>
                </Link>
              </div>
            ) : (
              confessions.map((confession) => (
                <ConfessionCard key={confession.id} confession={confession} />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link href="/submit">
          <Button 
            size="icon" 
            className="w-14 h-14 bg-adtu-blue hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            data-testid="button-floating-submit"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

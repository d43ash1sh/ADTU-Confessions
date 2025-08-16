import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, CheckCircle, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type ApiConfession } from "@/lib/api";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("admin-token"));
  const [adminToken, setAdminToken] = useState(localStorage.getItem("admin-token") || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => api.adminLogin(data),
    onSuccess: (response) => {
      localStorage.setItem("admin-token", response.token);
      setAdminToken(response.token);
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: pendingConfessions = [], isLoading: pendingLoading, refetch: refetchPending } = useQuery({
    queryKey: ['/api/admin/confessions'],
    queryFn: () => api.getPendingConfessions(adminToken),
    enabled: isLoggedIn && !!adminToken,
  });

  const { data: approvedConfessions = [], isLoading: approvedLoading, refetch: refetchApproved } = useQuery({
    queryKey: ['/api/confessions'],
    queryFn: () => api.getConfessions(),
    enabled: isLoggedIn && !!adminToken,
  });

  const approveMutation = useMutation({
    mutationFn: (confessionId: string) => api.approveConfession(confessionId, adminToken),
    onSuccess: () => {
      toast({
        title: "Confession Approved",
        description: "The confession has been approved and published.",
      });
      refetchPending();
      refetchApproved();
      queryClient.invalidateQueries({ queryKey: ['/api/confessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/confessions/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve confession.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (confessionId: string) => api.deleteConfession(confessionId, adminToken),
    onSuccess: () => {
      toast({
        title: "Confession Deleted",
        description: "The confession has been deleted.",
      });
      refetchPending();
      refetchApproved();
      queryClient.invalidateQueries({ queryKey: ['/api/confessions/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete confession.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setAdminToken("");
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
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

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Admin Access</h1>
            <p className="text-gray-600 dark:text-gray-400">Authorized personnel only</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your username"
                            {...field}
                            data-testid="input-admin-username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                            data-testid="input-admin-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-adtu-blue hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                    data-testid="button-admin-login"
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login to Admin Panel"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <span data-testid="text-pending-count">{pendingConfessions.length} Pending Confessions</span>
              <span data-testid="text-approved-count">{approvedConfessions.length} Approved Confessions</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Pending Confessions */}
        {pendingLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-3">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      <div className="flex space-x-3">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pendingConfessions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">All caught up!</h3>
                <p className="text-gray-500 dark:text-gray-400">No pending confessions to review.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingConfessions.map((confession: ApiConfession) => (
              <Card key={confession.id} className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                        PENDING REVIEW
                      </Badge>
                      <Badge 
                        className={categoryColors[confession.category] || categoryColors.other}
                        data-testid={`badge-admin-category-${confession.category}`}
                      >
                        {confession.category.charAt(0).toUpperCase() + confession.category.slice(1)}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-admin-date-${confession.id}`}>
                      {formatDate(confession.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-6" data-testid={`text-admin-confession-${confession.id}`}>
                    {confession.text}
                  </p>
                  
                  <Separator className="mb-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span>Confession ID: {confession.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(confession.id)}
                        disabled={deleteMutation.isPending || approveMutation.isPending}
                        className="flex items-center space-x-2"
                        data-testid={`button-delete-${confession.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(confession.id)}
                        disabled={approveMutation.isPending || deleteMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                        data-testid={`button-approve-${confession.id}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Approved Confessions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Approved Confessions</h2>
          
          {approvedLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-3">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="flex space-x-3">
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : approvedConfessions.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No approved confessions</h3>
                  <p className="text-gray-500 dark:text-gray-400">Approved confessions will appear here.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {approvedConfessions.map((confession: ApiConfession) => (
                <Card key={confession.id} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                          APPROVED
                        </Badge>
                        <Badge 
                          className={categoryColors[confession.category] || categoryColors.other}
                          data-testid={`badge-admin-category-${confession.category}`}
                        >
                          {confession.category.charAt(0).toUpperCase() + confession.category.slice(1)}
                        </Badge>
                        <Badge className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                          #{confession.displayId}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-admin-date-${confession.id}`}>
                        {formatDate(confession.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-6" data-testid={`text-admin-confession-${confession.id}`}>
                      {confession.text}
                    </p>
                    
                    <Separator className="mb-4" />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span>Confession ID: {confession.id.slice(0, 8)}...</span>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(confession.id)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center space-x-2"
                          data-testid={`button-delete-approved-${confession.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

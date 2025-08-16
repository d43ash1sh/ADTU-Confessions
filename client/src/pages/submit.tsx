import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const submitSchema = z.object({
  text: z.string()
    .min(10, "Confession must be at least 10 characters")
    .max(500, "Confession must not exceed 500 characters"),
  category: z.string().min(1, "Please select a category"),
});

type SubmitFormData = z.infer<typeof submitSchema>;

export default function Submit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      text: "",
      category: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: SubmitFormData) => api.submitConfession(data),
    onSuccess: () => {
      toast({
        title: "Confession Submitted!",
        description: "Your confession has been submitted and is pending review.",
      });
      form.reset();
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit confession. Please try again.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: "funny", label: "😂 Funny", description: "Share something that made you laugh" },
    { value: "crush", label: "💕 Crush", description: "Anonymous feelings and romance" },
    { value: "hostel", label: "🏠 Hostel", description: "Hostel life stories and experiences" },
    { value: "sad", label: "😢 Sad", description: "Share your struggles anonymously" },
    { value: "roast", label: "🔥 Roast", description: "Light-hearted roasts and burns" },
    { value: "academic", label: "📚 Academic", description: "Studies, exams, and university life" },
    { value: "friendship", label: "👫 Friendship", description: "Stories about friendships" },
    { value: "other", label: "💭 Other", description: "Everything else" },
  ];

  const onSubmit = (data: SubmitFormData) => {
    submitMutation.mutate(data);
  };

  const textLength = form.watch("text")?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Share Your Confession</h1>
          <p className="text-gray-600 dark:text-gray-400">Submit your anonymous confession. No registration required.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Anonymous Confession Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Category Selection */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Category</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-3"
                          data-testid="radio-group-category"
                        >
                          {categories.map((category) => (
                            <FormItem key={category.value}>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem 
                                    value={category.value} 
                                    id={category.value}
                                    data-testid={`radio-category-${category.value}`}
                                  />
                                  <label
                                    htmlFor={category.value}
                                    className="flex-1 flex flex-col p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <span className="font-medium text-sm">{category.label}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{category.description}</span>
                                  </label>
                                </div>
                              </FormControl>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confession Text */}
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Your Confession</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your anonymous confession here... Remember to be respectful!"
                          className="min-h-[120px] resize-none"
                          maxLength={500}
                          {...field}
                          data-testid="textarea-confession"
                        />
                      </FormControl>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-500 dark:text-gray-400">
                          Your confession will be reviewed before being published.
                        </p>
                        <span className={`${textLength > 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          {textLength}/500
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Guidelines */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Community Guidelines</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Keep it respectful and appropriate</li>
                    <li>• No harassment, hate speech, or personal attacks</li>
                    <li>• No sharing of personal information</li>
                    <li>• Academic integrity must be maintained</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-4 bg-adtu-blue hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit-confession"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Anonymous Confession"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

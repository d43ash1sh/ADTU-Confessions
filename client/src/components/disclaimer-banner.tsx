import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
      <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-100">
        This is an anonymous confession platform for ADTU students. All confessions are moderated before being published.
      </AlertDescription>
    </Alert>
  );
}
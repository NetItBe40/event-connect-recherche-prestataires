import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DescriptionFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  error: string | null;
  isLoading: boolean;
  DebugDialog?: () => JSX.Element;
}

export function DescriptionForm({
  description,
  onDescriptionChange,
  onSave,
  error,
  isLoading,
  DebugDialog
}: DescriptionFormProps) {
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="La description générée apparaîtra ici..."
        className="h-64"
      />

      <Button 
        onClick={onSave}
        disabled={!description}
        variant="outline"
        className="w-full"
      >
        Sauvegarder les modifications
      </Button>

      {DebugDialog && <DebugDialog />}
    </div>
  );
}
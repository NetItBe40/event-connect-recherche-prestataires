import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DebugInfo {
  step: string;
  placeId?: string;
  descriptionToSave?: string;
  descriptionArray?: string[];
  jsonString?: string;
  currentDescription?: string;
  supabaseResponse?: any;
  verificationResult?: {
    data?: any;
    error?: any;
    currentDescription?: string;
    parsedDescription?: any[];
  };
  error?: any;
}

interface DescriptionDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debugInfo: DebugInfo;
}

export function DescriptionDebugDialog({ 
  open, 
  onOpenChange, 
  debugInfo 
}: DescriptionDebugDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la sauvegarde</DialogTitle>
          <DialogDescription>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-bold">Étape</h3>
                <pre className="bg-slate-100 p-2 rounded mt-1">
                  {debugInfo.step}
                </pre>
              </div>
              
              <div>
                <h3 className="font-bold">ID du lieu</h3>
                <pre className="bg-slate-100 p-2 rounded mt-1">
                  {debugInfo.placeId}
                </pre>
              </div>

              <div>
                <h3 className="font-bold">Description à sauvegarder</h3>
                <pre className="bg-slate-100 p-2 rounded mt-1 whitespace-pre-wrap">
                  {debugInfo.descriptionToSave}
                </pre>
              </div>

              <div>
                <h3 className="font-bold">Tableau de description</h3>
                <pre className="bg-slate-100 p-2 rounded mt-1">
                  {JSON.stringify(debugInfo.descriptionArray, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-bold">JSON envoyé à Supabase</h3>
                <pre className="bg-slate-100 p-2 rounded mt-1">
                  {debugInfo.jsonString}
                </pre>
              </div>

              {debugInfo.currentDescription && (
                <div>
                  <h3 className="font-bold">Description avant mise à jour</h3>
                  <pre className="bg-slate-100 p-2 rounded mt-1">
                    {debugInfo.currentDescription}
                  </pre>
                </div>
              )}

              {debugInfo.verificationResult && (
                <div>
                  <h3 className="font-bold">Description actuellement en base</h3>
                  <pre className="bg-slate-100 p-2 rounded mt-1">
                    {debugInfo.verificationResult.currentDescription}
                  </pre>
                  <h3 className="font-bold mt-2">Description parsée</h3>
                  <pre className="bg-slate-100 p-2 rounded mt-1">
                    {JSON.stringify(debugInfo.verificationResult.parsedDescription, null, 2)}
                  </pre>
                </div>
              )}

              {debugInfo.supabaseResponse && (
                <div>
                  <h3 className="font-bold">Réponse de Supabase</h3>
                  <pre className="bg-slate-100 p-2 rounded mt-1">
                    {JSON.stringify(debugInfo.supabaseResponse, null, 2)}
                  </pre>
                </div>
              )}

              {debugInfo.error && (
                <div>
                  <h3 className="font-bold text-red-500">Erreur</h3>
                  <pre className="bg-slate-100 p-2 rounded mt-1">
                    {JSON.stringify(debugInfo.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
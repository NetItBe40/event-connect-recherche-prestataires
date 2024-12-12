import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DebugInfo {
  step: string;
  placeId?: string;
  descriptionToSave?: string;
  currentDescription?: string;
  updateResponse?: any;
  verificationResult?: {
    data?: any;
    currentDescription?: string;
    rawResponse?: any;
  };
  error?: any;
  rawResponse?: any;
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
            Informations détaillées sur le processus de sauvegarde de la description
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-bold">Étape</h3>
            <pre className="bg-slate-100 p-2 rounded mt-1">
              {debugInfo.step}
            </pre>
          </div>

          {debugInfo.error && (
            <div>
              <h3 className="font-bold text-red-500">Erreur</h3>
              <pre className="bg-slate-100 p-2 rounded mt-1">
                {JSON.stringify(debugInfo.error, null, 2)}
              </pre>
            </div>
          )}
          
          <div>
            <h3 className="font-bold">ID du lieu</h3>
            <pre className="bg-slate-100 p-2 rounded mt-1">
              {debugInfo.placeId}
            </pre>
          </div>

          <div>
            <h3 className="font-bold">Description avant mise à jour</h3>
            <pre className="bg-slate-100 p-2 rounded mt-1 whitespace-pre-wrap">
              {debugInfo.currentDescription || "Aucune description"}
            </pre>
          </div>

          <div>
            <h3 className="font-bold">Description à sauvegarder</h3>
            <pre className="bg-slate-100 p-2 rounded mt-1 whitespace-pre-wrap">
              {debugInfo.descriptionToSave}
            </pre>
          </div>

          {debugInfo.updateResponse && (
            <div>
              <h3 className="font-bold">Réponse de la mise à jour</h3>
              <pre className="bg-slate-100 p-2 rounded mt-1">
                {JSON.stringify(debugInfo.updateResponse, null, 2)}
              </pre>
            </div>
          )}

          {debugInfo.verificationResult?.currentDescription && (
            <div>
              <h3 className="font-bold">Description après sauvegarde</h3>
              <pre className="bg-slate-100 p-2 rounded mt-1">
                {debugInfo.verificationResult.currentDescription}
              </pre>
            </div>
          )}

          {debugInfo.rawResponse && (
            <div>
              <h3 className="font-bold">Réponse brute</h3>
              <pre className="bg-slate-100 p-2 rounded mt-1">
                {JSON.stringify(debugInfo.rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
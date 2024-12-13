import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DebugInfo {
  website?: string;
  apiResponse?: any;
  error?: any;
}

interface EnrichmentDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debugInfo: DebugInfo;
}

export function EnrichmentDebugDialog({ 
  open, 
  onOpenChange, 
  debugInfo 
}: EnrichmentDebugDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la recherche</DialogTitle>
          <DialogDescription>
            Informations détaillées sur la recherche des réseaux sociaux
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-bold">URL du site web envoyée</h3>
            <pre className="bg-slate-100 p-2 rounded mt-1">
              {debugInfo.website || "Aucune URL"}
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
            <h3 className="font-bold">Réponse de l'API</h3>
            <pre className="bg-slate-100 p-2 rounded mt-1">
              {JSON.stringify(debugInfo.apiResponse, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
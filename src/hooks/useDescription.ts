import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function useDescription(placeId?: string, initialDescription?: string) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [debugDialog, setDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialDescription) {
      try {
        const parsed = JSON.parse(initialDescription);
        if (Array.isArray(parsed)) {
          const text = parsed
            .filter(item => item && typeof item === 'string' && item !== 't')
            .join('\n\n');
          setDescription(text);
        }
      } catch (error) {
        setDescription(initialDescription);
      }
    }
  }, [initialDescription]);

  const handleSaveDescription = async () => {
    if (!placeId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description",
      });
      return;
    }

    try {
      // Préparation des données pour la sauvegarde
      const descriptionArray = [description];
      
      // Stockage des informations de debug
      setDebugInfo({
        step: "Début de la sauvegarde",
        placeId,
        descriptionToSave: description,
        descriptionArray,
        jsonString: JSON.stringify(descriptionArray)
      });
      
      // Tentative de sauvegarde
      const { data, error: updateError } = await supabase
        .from('places')
        .update({ 
          description: JSON.stringify(descriptionArray)
        })
        .eq('id', placeId)
        .select();

      // Mise à jour des informations de debug avec le résultat
      setDebugInfo(prev => ({
        ...prev,
        step: "Après la sauvegarde",
        supabaseResponse: { data, error: updateError }
      }));

      // Affichage de la modale de debug
      setDebugDialog(true);

      if (updateError) throw updateError;

      toast({
        title: "Succès",
        description: "La description a été sauvegardée",
      });
    } catch (error) {
      setError("Impossible de sauvegarder la description");
      setDebugInfo(prev => ({
        ...prev,
        step: "Erreur",
        error
      }));
      setDebugDialog(true);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description",
      });
    }
  };

  const DebugDialog = () => (
    <Dialog open={debugDialog} onOpenChange={setDebugDialog}>
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

  return {
    description,
    setDescription,
    error,
    handleSaveDescription,
    DebugDialog
  };
}
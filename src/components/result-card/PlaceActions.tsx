import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlaceActionsProps {
  placeId?: string;
  title: string;
  onDelete?: () => void;
}

export function PlaceActions({ placeId, title, onDelete }: PlaceActionsProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      if (!placeId) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer cette fiche",
        });
        return;
      }

      console.log("Tentative de suppression du lieu avec place_id:", placeId);

      const { error } = await supabase
        .from('places')
        .delete()
        .eq('place_id', placeId);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "La fiche prestataire a été supprimée avec succès",
      });

      if (onDelete) {
        onDelete();
      }

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement la fiche de {title}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
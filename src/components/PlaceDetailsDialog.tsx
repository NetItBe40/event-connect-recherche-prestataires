import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlaceDetails } from "./place/PlaceDetails";

interface Place {
  id?: string;
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  placeId?: string;
  placeLink?: string;
  priceLevel?: string;
  openingHours?: {
    [key: string]: string;
  };
  city?: string;
  verified?: boolean;
  photos?: string;
  state?: string;
  description?: string;
}

interface PlaceDetailsDialogProps {
  place: Place;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlaceDetailsDialog({ place, open, onOpenChange }: PlaceDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{place.title}</DialogTitle>
        </DialogHeader>
        <PlaceDetails place={place} />
      </DialogContent>
    </Dialog>
  );
}
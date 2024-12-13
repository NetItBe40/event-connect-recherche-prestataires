import { supabase } from "@/integrations/supabase/client";
import { EnrichmentData } from "@/types/enrichment";

export async function savePlaceData(placeId: string, data: EnrichmentData) {
  const { error } = await supabase
    .from("places")
    .update({
      website: data.website,
      phone: data.phone,
      type: data.type,
      opening_hours: data.openingHours,
      facebook: data.facebook,
      instagram: data.instagram,
      tiktok: data.tiktok,
      snapchat: data.snapchat,
      twitter: data.twitter,
      linkedin: data.linkedin,
      github: data.github,
      youtube: data.youtube,
      pinterest: data.pinterest,
      email_1: data.email_1,
      email_2: data.email_2,
    })
    .eq("id", placeId);

  if (error) throw error;
}
interface PlaceSummaryBasicInfoProps {
  title: string;
  address: string;
  city?: string;
  state?: string;
  phone?: string;
  type?: string;
  website?: string;
  rating?: string;
  reviews?: string;
  price_level?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  place_link?: string;
  verified?: boolean;
}

export function PlaceSummaryBasicInfo({ 
  title,
  address,
  city,
  state,
  phone,
  type,
  website,
  rating,
  reviews,
  price_level,
  latitude,
  longitude,
  timezone,
  place_link,
  verified
}: PlaceSummaryBasicInfoProps) {
  return (
    <div className="space-y-2">
      <p><strong>Nom :</strong> {title}</p>
      <p><strong>Adresse :</strong> {address}</p>
      
      {city && <p><strong>Ville :</strong> {city}</p>}
      {state && <p><strong>État :</strong> {state}</p>}
      {phone && <p><strong>Téléphone :</strong> {phone}</p>}
      {type && <p><strong>Type :</strong> {type}</p>}
      
      {website && (
        <p>
          <strong>Site web :</strong>{" "}
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {website}
          </a>
        </p>
      )}
      
      {rating && <p><strong>Note :</strong> {rating}/5</p>}
      {reviews && <p><strong>Avis :</strong> {reviews}</p>}
      {price_level && <p><strong>Niveau de prix :</strong> {price_level}</p>}
      
      {(latitude && longitude) && (
        <p><strong>Coordonnées :</strong> {latitude}, {longitude}</p>
      )}
      
      {timezone && <p><strong>Fuseau horaire :</strong> {timezone}</p>}
      
      {place_link && (
        <p>
          <strong>Lien Google Maps :</strong>{" "}
          <a 
            href={place_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Voir sur Google Maps
          </a>
        </p>
      )}
      
      {verified && <p><strong>Vérifié :</strong> Oui</p>}
    </div>
  );
}
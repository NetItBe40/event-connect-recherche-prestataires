interface PlaceDescriptionProps {
  description?: string;
}

export function PlaceDescription({ description }: PlaceDescriptionProps) {
  const parseDescription = (description?: string) => {
    if (!description) return "";
    try {
      const parsed = JSON.parse(description);
      return Array.isArray(parsed) ? parsed[0] : description;
    } catch (e) {
      console.error("Erreur lors du parsing de la description:", e);
      return description;
    }
  };

  const parsedDescription = parseDescription(description);
  
  if (!parsedDescription) return null;

  return (
    <div>
      <strong>Description :</strong>
      <p className="mt-1 text-gray-600 whitespace-pre-line">{parsedDescription}</p>
    </div>
  );
}
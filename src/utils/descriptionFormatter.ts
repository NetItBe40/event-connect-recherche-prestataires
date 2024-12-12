export const parseDescription = (description: string | null): string => {
  if (!description) return "";
  
  try {
    const parsed = JSON.parse(description);
    if (Array.isArray(parsed)) {
      return parsed
        .filter(item => item && typeof item === 'string' && item !== 't')
        .join('\n\n');
    }
    return description;
  } catch (error) {
    return description;
  }
};

export const formatDescriptionForSave = (description: string, existingDescription: string | null = null): string[] => {
  const cleanDescription = description.trim();
  
  // Si nous avons une description existante, essayons de la parser
  if (existingDescription) {
    try {
      const existingArray = JSON.parse(existingDescription);
      if (Array.isArray(existingArray)) {
        // Créer un nouveau tableau avec la nouvelle description en première position
        // tout en préservant les autres éléments
        return [
          cleanDescription,
          existingArray[1] || null,
          existingArray[2] || null,
          existingArray[3] || "t",
          existingArray[4] || "t"
        ];
      }
    } catch (error) {
      console.error("Erreur lors du parsing de la description existante:", error);
    }
  }
  
  // Si pas de description existante ou erreur de parsing, créer un nouveau tableau
  return [cleanDescription, null, null, "t", "t"];
};
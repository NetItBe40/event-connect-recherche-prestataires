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

export const formatDescriptionForSave = (description: string): string[] => {
  const cleanDescription = description.trim();
  const parts = cleanDescription.split('\n\n').filter(Boolean);
  return [...parts, null, "t", "t"];
};
import { Category } from "@/types/categories";
import { generateDescription } from "@/api/generate-description";

export async function analyzePlaceWithAI(description: string, type: string, categories: Category[]): Promise<string[]> {
  try {
    console.log("Début de l'analyse AI avec description:", description);
    
    const prompt = `
Analyse le profil du prestataire suivant en fonction de la liste des catégories disponibles. Classe ce prestataire uniquement dans les catégories dont les services ou activités sont clairement et explicitement mentionnés dans la description fournie. Ne fais aucune supposition ou extrapolation.

Description du prestataire :
${description}

Type d'établissement : ${type}

Catégories disponibles :
${categories.map(cat => `${cat.name}:
${cat.subcategories.map(sub => `- ${sub.name}`).join('\n')}`).join('\n\n')}

1. Classe uniquement le prestataire dans les catégories **explicitement** liées à ses services.
2. Si aucune catégorie ne correspond parfaitement, indique qu'aucune catégorie adéquate n'est disponible.

### Résultat attendu :
- Liste des sous-catégories pertinentes : [liste des noms exacts des sous-catégories]
`;

    console.log("Envoi du prompt à GPT-4:", prompt);

    const response = await generateDescription(prompt);
    console.log("Réponse de GPT-4:", response);

    // Extraction des sous-catégories suggérées
    const suggestedIds: string[] = [];
    categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (response?.toLowerCase().includes(subcategory.name.toLowerCase())) {
          suggestedIds.push(subcategory.id);
        }
      });
    });

    console.log("Sous-catégories suggérées:", suggestedIds);
    return suggestedIds;
  } catch (error) {
    console.error("Erreur lors de l'analyse AI:", error);
    return [];
  }
}
export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  suggested?: boolean;
}

export interface CategorySuggestion {
  categoryId: string;
  subcategoryIds: string[];
}
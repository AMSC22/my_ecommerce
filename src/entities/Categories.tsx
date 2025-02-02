export interface Category {
  id: string;
  name: string;
  created_by: string;
  description: string;
  parent_category_id?: string;
  icon_url: string;
  is_active: boolean;
  is_pending: boolean;
  productCount?: number;
  sales?: number;
}

export interface SubCategory {
  id: string;
  name: string;
  created_by: string;
  description: string;
  parent_category_id?: string;
  icon_url: string;
  is_active: boolean;
  is_pending: boolean;
  productCount?: number;
  sales?: number;
  category_id: string;
}
/**
 * API config — points to the PHP backend hosted at draminesaid.com/directadmin/atlasagricol/
 * Override in dev with VITE_API_BASE.
 */
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string) ||
  'https://draminesaid.com/directadmin/atlasagricol';

export const API = {
  productsList: `${API_BASE}/products/list.php`,
  productGet: (slugOrId: string, byId = false) =>
    `${API_BASE}/products/get.php?${byId ? 'id' : 'slug'}=${encodeURIComponent(slugOrId)}`,
  productCreate: `${API_BASE}/products/create.php`,
  productUpdate: `${API_BASE}/products/update.php`,
  productDelete: (id: number | string) => `${API_BASE}/products/delete.php?id=${id}`,
  imageUpload: `${API_BASE}/products/upload-image.php`,
  imageDelete: `${API_BASE}/products/delete-image.php`,
  visitorsTrack: `${API_BASE}/visitors/track.php`,
  visitorsList: `${API_BASE}/visitors/list.php`,
  visitorsStats: `${API_BASE}/visitors/stats.php`,
  categoriesList: `${API_BASE}/categories/list.php`,
  categoryCreate: `${API_BASE}/categories/create.php`,
  categoryUpdate: `${API_BASE}/categories/update.php`,
  categoryDelete: (id: number | string) => `${API_BASE}/categories/delete.php?id=${id}`,
};

// Legacy exports still used in some pages
export const PRODUCTS_ENDPOINT = API.productsList;
export const PRODUCT_DETAIL_ENDPOINT = (slug: string) => API.productGet(slug);

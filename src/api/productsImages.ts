// src/api/productsImages 
import apiRequest from '.';

interface ProductImage {
  id: number;
  url: string;
  product_id: number;
}

// Получение изображения
export const getProductImage = async (imageId: number) => {
  return apiRequest<ProductImage>(`/shop/products/image/${imageId}/`, 'GET');
};

// Добавление изображения
export const createProductImage = async (imageData: { url: string; product_id: number }) => {
  return apiRequest<ProductImage>(`/shop/products/image/${imageData.product_id}/`, 'POST', {
    body: imageData,
  });
};

// Обновление изображения
export const updateProductImage = async (imageId: number, imageData: Partial<ProductImage>) => {
  return apiRequest<ProductImage>(`/shop/products/image/${imageId}/`, 'PUT', {
    body: imageData,
  });
};

// Удаление изображения
export const deleteProductImage = async (imageId: number) => {
  return apiRequest<null>(`/shop/products/image/${imageId}/`, 'DELETE');
};
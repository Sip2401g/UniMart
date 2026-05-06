const uploadsBase =
  import.meta.env.VITE_UPLOADS_URL ||
  (import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "http://localhost:5000");

export const getProductImageUrl = (imageName) => {
  if (!imageName) {
    return "https://placehold.co/400x300?text=No+Image";
  }

  if (/^https?:\/\//i.test(imageName)) {
    return imageName;
  }

  return `${uploadsBase.replace(/\/$/, "")}/uploads/${imageName.replace(/^\//, "")}`;
};

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { getProductImageUrl } from "../utils/imageUrl";
import AIChatbot from "../components/AIChatbot";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!product) return <div className="empty-state">Product not found.</div>;

  const images = product.images?.length > 0
    ? product.images.map((img) => getProductImageUrl(img))
    : ["https://placehold.co/600x400?text=No+Image"];

  return (
    <div className="detail-page">

      {/* 🔥 AI CHATBOT (correct placement) */}
      <div className="detail-chatbot-wrap">
        <AIChatbot product={product} />
      </div>

      {/* Images Section */}
      <div className="detail-images">
        <img
          src={images[activeImg]}
          alt={product.title}
          className="detail-main-img"
        />

        {images.length > 1 && (
          <div className="detail-thumbnails">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`thumb-${i}`}
                className={`detail-thumb ${i === activeImg ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="detail-info">
        <span className="product-category">{product.category}</span>
        <h1>{product.title}</h1>
        <p className="detail-price">₹{product.price.toLocaleString()}</p>

        <div className="detail-meta">
          <span>
            Condition: <strong>{product.condition}</strong>
          </span>
          {product.isSold && <span className="sold-badge">SOLD</span>}
        </div>

        <p className="detail-description">{product.description}</p>

        {/* Seller Info */}
        <div className="seller-card">
          <h3>Seller Info</h3>
          <p><strong>{product.seller?.name}</strong></p>
          <p>{product.seller?.college}</p>

          {product.seller?.phone && (
            <a href={`tel:${product.seller.phone}`} className="btn-contact">
              Call Seller
            </a>
          )}

          {product.seller?.email && (
            <a href={`mailto:${product.seller.email}`} className="btn-contact-outline">
              Email Seller
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
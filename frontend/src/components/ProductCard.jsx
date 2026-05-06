import { Link } from "react-router-dom";
import { getProductImageUrl } from "../utils/imageUrl";

const ProductCard = ({ product }) => {
  const imageSrc =
    product.images?.length > 0
      ? getProductImageUrl(product.images[0])
      : "https://placehold.co/400x300?text=No+Image";

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-img-wrap">
        <img src={imageSrc} alt={product.title} className="product-card-img" />
        {product.isSold && <span className="sold-badge">SOLD</span>}
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <span className="product-condition">{product.condition}</span>
        </div>
        <p className="product-seller">{product.seller?.college}</p>
        <p className="product-contact">{product.seller?.email || "Email unavailable"}</p>
        <p className="product-contact">{product.seller?.phone || "Phone unavailable"}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
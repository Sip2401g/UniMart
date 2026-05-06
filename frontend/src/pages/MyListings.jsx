import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { getProductImageUrl } from "../utils/imageUrl";

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = useCallback(async () => {
    try {
      const { data } = await api.get("/products/my");
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkSold = async (id) => {
    try {
      await api.patch(`/products/${id}/sold`);
      fetchMyListings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchMyListings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    void fetchMyListings();
  }, [fetchMyListings]);

  if (loading) return <div className="loading-state">Loading your listings...</div>;

  return (
    <div className="my-listings-page">
      <h2>My Listings</h2>
      {products.length === 0 ? (
        <div className="empty-state">You haven't listed anything yet.</div>
      ) : (
        <div className="my-listings-grid">
          {products.map((p) => (
            <div key={p._id} className={`my-listing-card ${p.isSold ? "is-sold" : ""}`}>
              <img
                src={p.images?.[0] ? getProductImageUrl(p.images[0]) : "https://placehold.co/200x150?text=No+Image"}
                alt={p.title}
              />
              <div className="my-listing-info">
                <h3>{p.title}</h3>
                <p>₹{p.price.toLocaleString()} · {p.condition} · {p.category}</p>
                <span className={`status-badge ${p.isSold ? "sold" : "active"}`}>
                  {p.isSold ? "Sold" : "Active"}
                </span>
              </div>
              <div className="my-listing-actions">
                {!p.isSold && (
                  <button className="btn-sold" onClick={() => handleMarkSold(p._id)}>
                    Mark Sold
                  </button>
                )}
                <button className="btn-delete" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
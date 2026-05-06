import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

const CollegeAdminPanel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await api.get("/products/admin/college-dashboard");
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load college dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const markSold = async (id) => {
    try {
      await api.patch(`/products/${id}/admin/sold`);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark sold");
    }
  };

  const deleteListing = async (id) => {
    if (!confirm("Delete this listing from your college?")) return;
    try {
      await api.delete(`/products/${id}/admin`);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  if (loading) return <div className="loading-state">Loading college dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>College Head Panel</h2>
        <p>Manage listings posted by students from your campus.</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">No listings from your college yet.</div>
      ) : (
        <div className="admin-list">
          {items.map((p) => (
            <div className="admin-card" key={p._id}>
              <div>
                <h3>{p.title}</h3>
                <p>₹{p.price.toLocaleString()} · {p.category} · {p.condition}</p>
                <p><strong>Seller:</strong> {p.seller?.name} ({p.seller?.college})</p>
                <p><strong>Email:</strong> {p.seller?.email || "N/A"}</p>
                <p><strong>Phone:</strong> {p.seller?.phone || "N/A"}</p>
              </div>
              <div className="admin-actions">
                {!p.isSold && (
                  <button className="btn-sold" onClick={() => markSold(p._id)}>
                    Mark Sold
                  </button>
                )}
                <button className="btn-delete" onClick={() => deleteListing(p._id)}>
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

export default CollegeAdminPanel;

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Books", "Electronics", "Furniture", "Clothing", "Stationery", "Sports", "Other"];
const CONDITIONS = ["All", "New", "Like New", "Good", "Fair", "Poor"];

const DUMMY_PRODUCTS = [
  { _id: "d1", title: "Engineering Mathematics Vol.2", price: 280, category: "Books", condition: "Good", images: [], isSold: false, seller: { college: "MIT Pune" } },
  { _id: "d2", title: "Dell Inspiron 15 Laptop", price: 28000, category: "Electronics", condition: "Like New", images: [], isSold: false, seller: { college: "VIT Pune" } },
  { _id: "d3", title: "Wooden Study Table", price: 1800, category: "Furniture", condition: "Good", images: [], isSold: false, seller: { college: "COEP Pune" } },
  { _id: "d4", title: "Physics NCERT Class 12", price: 120, category: "Books", condition: "Like New", images: [], isSold: false, seller: { college: "Symbiosis Pune" } },
  { _id: "d5", title: "Sony WH-1000XM4 Headphones", price: 12000, category: "Electronics", condition: "Good", images: [], isSold: false, seller: { college: "MIT Pune" } },
  { _id: "d6", title: "Nike Sports Shoes Size 9", price: 1500, category: "Sports", condition: "Like New", images: [], isSold: false, seller: { college: "Fergusson College" } },
  { _id: "d7", title: "Data Structures Textbook", price: 350, category: "Books", condition: "Good", images: [], isSold: false, seller: { college: "PICT Pune" } },
  { _id: "d8", title: "Single Bed with Mattress", price: 4500, category: "Furniture", condition: "Fair", images: [], isSold: false, seller: { college: "VIT Pune" } },
  { _id: "d9", title: "Casio FX-991ES Calculator", price: 600, category: "Stationery", condition: "New", images: [], isSold: false, seller: { college: "COEP Pune" } },
  { _id: "d10", title: "Men's Formal Shirt (M)", price: 400, category: "Clothing", condition: "Like New", images: [], isSold: false, seller: { college: "MIT Pune" } },
  { _id: "d11", title: "iPad 9th Gen 64GB", price: 22000, category: "Electronics", condition: "Good", images: [], isSold: false, seller: { college: "Symbiosis Pune" } },
  { _id: "d12", title: "Cricket Bat + Pads Set", price: 1200, category: "Sports", condition: "Good", images: [], isSold: false, seller: { college: "Fergusson College" } },
];

const CATEGORY_META = {
  All:         { color: "#2563eb", bg: "#eff6ff" },
  Books:       { color: "#7c3aed", bg: "#f5f3ff" },
  Electronics: { color: "#0891b2", bg: "#ecfeff" },
  Furniture:   { color: "#b45309", bg: "#fffbeb" },
  Clothing:    { color: "#be185d", bg: "#fdf2f8" },
  Stationery:  { color: "#15803d", bg: "#f0fdf4" },
  Sports:      { color: "#c2410c", bg: "#fff7ed" },
  Other:       { color: "#475569", bg: "#f8fafc" },
};

const DUMMY_BG = [
  "#f0f4ff","#fff7ed","#f0fdf4","#fdf4ff",
  "#fff1f2","#ecfeff","#fefce8","#f0fdfa",
  "#fef9c3","#f0f9ff","#faf5ff","#fff8f1",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [college, setCollege] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (condition !== "All") params.condition = condition;
      if (college !== "All") params.college = college;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await api.get("/products", { params });
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition, college, minPrice, maxPrice]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const allProducts = [...products, ...DUMMY_PRODUCTS];

  const filtered = allProducts.filter((p) => {
    if (college !== "All" && p.seller?.college !== college) return false;
    if (category !== "All" && p.category !== category) return false;
    if (condition !== "All" && p.condition !== condition) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  const clearFilters = () => {
    setCategory("All"); setCondition("All");
    setCollege("All");
    setMinPrice(""); setMaxPrice(""); setSearch("");
  };

  const colleges = ["All", ...new Set(allProducts.map((p) => p.seller?.college).filter(Boolean))];
  const activeListings = filtered.filter((p) => !p.isSold).length;
  const collegeCount = new Set(filtered.map((p) => p.seller?.college).filter(Boolean)).size;
  const averagePrice = filtered.length
    ? Math.round(filtered.reduce((sum, p) => sum + (Number(p.price) || 0), 0) / filtered.length)
    : 0;
  const recentlyAdded = filtered.slice(0, 6).length;

  return (
    <div className="home-page">

      {/* HERO */}
      <div className="home-hero">
        <div className="hero-bg-layer"></div>
        <div className="hero-content">
          <div className="hero-pill">India's Campus Marketplace</div>
          <h1>Find great deals<br />on campus <span className="hero-blue">today</span></h1>
          <p>Buy and sell with students from your college — textbooks, gadgets, furniture and more.</p>
          <form onSubmit={(e) => { e.preventDefault(); fetchProducts(); }} className="search-bar">
            <svg className="search-svg" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#94a3b8" strokeWidth="1.8"/>
              <path d="M14 14l3 3" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search for books, laptops, cycles..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit">Search</button>
          </form>
          <div className="hero-quick-tags">
            {["Textbooks", "Laptops", "Cycles", "Furniture", "Calculators"].map((tag) => (
              <span key={tag} className="hero-qtag" onClick={() => { setSearch(tag); fetchProducts(); }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        {[
          { value: activeListings, label: "Live Listings" },
          { value: collegeCount, label: "Colleges in Results" },
          { value: `₹${averagePrice.toLocaleString()}`, label: "Average Price" },
          { value: recentlyAdded, label: "Recently Added" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <p className="stat-val">{s.value}</p>
            <p className="stat-lbl">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CATEGORY TABS */}
      <div className="cat-tabs">
        {CATEGORIES.map((c) => {
          const meta = CATEGORY_META[c];
          return (
            <button
              key={c}
              className={`cat-tab ${category === c ? "cat-tab-active" : ""}`}
              style={category === c ? { background: meta.bg, color: meta.color, borderColor: meta.color } : {}}
              onClick={() => setCategory(c)}
            >{c}</button>
          );
        })}
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-bar-left">
          <div className="fb-group">
            <span className="fb-label">Condition</span>
            <div className="fb-pills">
              {CONDITIONS.map((c) => (
                <button key={c} className={`fb-pill ${condition === c ? "fb-pill-active" : ""}`}
                  onClick={() => setCondition(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="fb-group">
            <span className="fb-label">College</span>
            <div className="fb-price">
              <select value={college} onChange={(e) => setCollege(e.target.value)} className="fb-college-select">
                {colleges.map((clg) => (
                  <option key={clg} value={clg}>{clg}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="fb-group">
            <span className="fb-label">Price Range (₹)</span>
            <div className="fb-price">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <span className="fb-dash">to</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              <button className="fb-apply" onClick={fetchProducts}>Apply</button>
            </div>
          </div>
        </div>
        {(condition !== "All" || college !== "All" || minPrice || maxPrice || search) && (
          <button className="fb-clear" onClick={clearFilters}>Clear filters</button>
        )}
      </div>

      {/* RESULTS */}
      <div className="results-bar">
        <span className="results-count">{filtered.length} listings</span>
        {category !== "All" && (
          <span className="results-chip" style={{ background: CATEGORY_META[category].bg, color: CATEGORY_META[category].color }}>
            {category}
          </span>
        )}
      </div>

      {/* GRID */}
      {loading ? (
        <div className="products-grid">
          {[...Array(8)].map((_, i) => <div key={i} className="skel-card"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>No results found</p>
          <p>Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((p, i) =>
            p._id.startsWith("d")
              ? <DummyCard key={p._id} product={p} index={i} />
              : <ProductCard key={p._id} product={p} />
          )}
        </div>
      )}
    </div>
  );
};

const DummyCard = ({ product, index }) => (
  <div className="product-card">
    <div className="product-card-img-wrap" style={{ background: DUMMY_BG[index % DUMMY_BG.length] }}>
      <div className="dummy-label">{product.category}</div>
      <span className="cond-badge">{product.condition}</span>
    </div>
    <div className="product-card-body">
      <span className="product-category">{product.category}</span>
      <h3 className="product-title">{product.title}</h3>
      <div className="product-footer">
        <span className="product-price">₹{product.price.toLocaleString()}</span>
        <span className="product-condition">{product.condition}</span>
      </div>
      <p className="product-seller">{product.seller?.college}</p>
    </div>
  </div>
);

export default Home;
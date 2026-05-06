import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Stationery", "Sports", "Other"];
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

const CONDITION_DESC = {
  "New": "Never used, in original packaging",
  "Like New": "Used once or twice, no visible wear",
  "Good": "Minor signs of use, fully functional",
  "Fair": "Noticeable wear but works perfectly",
  "Poor": "Heavy wear, may need minor repair",
};

const AddProduct = () => {
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Books", condition: "Good" });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    const newImages = images.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("images", img));
      await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/my-listings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="sell-page">
      <div className="sell-left">
        <div className="sell-left-inner">
          <h2>Create a Listing</h2>
          <p className="sell-sub">Fill in the details to list your item for sale</p>

          {/* Progress */}
          <div className="sell-steps">
            {["Item Details", "Pricing & Condition", "Photos"].map((s, i) => (
              <div key={s} className={`sell-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
                onClick={() => setStep(i + 1)}>
                <div className="step-num">{step > i + 1 ? "✓" : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="sell-progress-bar">
            <div className="sell-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="sell-form">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="sell-step-content">
                <div className="form-group">
                  <label>Item Title *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. Engineering Mathematics Textbook — 3rd Edition" required />
                  <span className="field-hint">Be specific — good titles get more views</span>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Describe your item — edition, included accessories, why you're selling it..." rows={5} required />
                  <span className="field-hint">{form.description.length}/500 characters</span>
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <div className="category-grid">
                    {CATEGORIES.map((c) => (
                      <button type="button" key={c}
                        className={`cat-select-btn ${form.category === c ? "selected" : ""}`}
                        onClick={() => setForm({ ...form, category: c })}>{c}</button>
                    ))}
                  </div>
                </div>
                <button type="button" className="btn-next" onClick={() => setStep(2)}
                  disabled={!form.title || !form.description}>
                  Continue to Pricing
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="sell-step-content">
                <div className="form-group">
                  <label>Asking Price (₹) *</label>
                  <div className="price-input-wrap">
                    <span className="price-prefix">₹</span>
                    <input type="number" name="price" value={form.price} onChange={handleChange}
                      placeholder="0" min="0" required className="price-input" />
                  </div>
                  {form.price && (
                    <span className="field-hint">
                      Listing for ₹{Number(form.price).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Item Condition *</label>
                  <div className="condition-list">
                    {CONDITIONS.map((c) => (
                      <div key={c}
                        className={`condition-option ${form.condition === c ? "selected" : ""}`}
                        onClick={() => setForm({ ...form, condition: c })}>
                        <div className="condition-radio">
                          {form.condition === c && <div className="condition-dot"></div>}
                        </div>
                        <div>
                          <p className="condition-name">{c}</p>
                          <p className="condition-desc">{CONDITION_DESC[c]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sell-btn-row">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="btn-next" onClick={() => setStep(3)}
                    disabled={!form.price}>Continue to Photos</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="sell-step-content">
                <div className="form-group">
                  <label>Photos (up to 4)</label>
                  <div className="upload-zone" onClick={() => document.getElementById("img-input").click()}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <p>Click to upload photos</p>
                    <span>JPG, PNG or WebP — max 5MB each</span>
                    <input id="img-input" type="file" accept="image/*" multiple onChange={handleImages} style={{ display: "none" }} />
                  </div>
                  {previews.length > 0 && (
                    <div className="preview-grid">
                      {previews.map((src, i) => (
                        <div key={i} className="preview-wrap">
                          <img src={src} alt="" className="preview-img" />
                          <button type="button" className="preview-remove" onClick={() => removeImage(i)}>×</button>
                          {i === 0 && <span className="preview-main-badge">Cover</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="listing-summary">
                  <h4>Listing Summary</h4>
                  <p className="field-hint">Your registered Gmail and phone will be visible to buyers.</p>
                  <div className="summary-row"><span>Title</span><strong>{form.title}</strong></div>
                  <div className="summary-row"><span>Category</span><strong>{form.category}</strong></div>
                  <div className="summary-row"><span>Condition</span><strong>{form.condition}</strong></div>
                  <div className="summary-row"><span>Price</span><strong>₹{Number(form.price || 0).toLocaleString()}</strong></div>
                  <div className="summary-row"><span>Photos</span><strong>{previews.length} uploaded</strong></div>
                </div>

                <div className="sell-btn-row">
                  <button type="button" className="btn-back" onClick={() => setStep(2)}>Back</button>
                  <button type="submit" className="btn-publish" disabled={loading}>
                    {loading ? "Publishing..." : "Publish Listing"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* RIGHT SIDE TIPS */}
      <div className="sell-right">
        <div className="sell-tips">
          <h4>Tips for a great listing</h4>
          {[
            { title: "Clear title", desc: "Include the brand, model or edition for better search visibility." },
            { title: "Good photos", desc: "Natural light photos from multiple angles get 3x more responses." },
            { title: "Fair price", desc: "Search similar items to price competitively and sell faster." },
            { title: "Detailed description", desc: "Mention defects honestly — it builds trust with buyers." },
          ].map((t) => (
            <div className="sell-tip" key={t.title}>
              <div className="tip-dot"></div>
              <div>
                <p className="tip-title">{t.title}</p>
                <p className="tip-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="sell-safety">
          <h4>Safety reminder</h4>
          <p>Always meet buyers in public places on your campus. Never share your home address.</p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
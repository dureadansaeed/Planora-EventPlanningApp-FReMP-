import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminComponents/AdminLayout";
import { createService, deleteService, fetchServices, updateService } from "../api";

const emptyForm = {
  title: "",
  category: "",
  price: "",
  duration: "",
  image: "",
  description: "",
  details: "",
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const data = await fetchServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      setServices([]);
      setFeedback({ type: "error", message: error.message || "Failed to load services" });
    } finally {
      setLoading(false);
    }
  }

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return services;

    return services.filter((service) =>
      [service.title, service.category, service.description, service.details]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [services, search]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
  }

  function startEdit(service) {
    setEditingId(service._id);
    setForm({
      title: service.title || "",
      category: service.category || "",
      price: service.price ?? "",
      duration: service.duration || "",
      image: service.image || "",
      description: service.description || "",
      details: service.details || "",
    });
    setFeedback({ type: "", message: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        ...form,
        price: form.price,
      };

      if (editingId) {
        await updateService(editingId, payload);
        setFeedback({ type: "success", message: "Service updated successfully." });
      } else {
        await createService(payload);
        setFeedback({ type: "success", message: "Service created successfully." });
      }

      resetForm();
      await loadServices();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to save service" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(service) {
    const confirmed = window.confirm(`Delete "${service.title}"?`);
    if (!confirmed) return;

    setFeedback({ type: "", message: "" });
    try {
      await deleteService(service._id);
      if (editingId === service._id) {
        resetForm();
      }
      setFeedback({ type: "success", message: "Service deleted successfully." });
      await loadServices();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to delete service" });
    }
  }

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <section style={heroCardStyle}>
          <div>
            <div style={eyebrowStyle}>Admin service management</div>
            <h2 style={headlineStyle}>Create, update, and retire service offerings from one place.</h2>
            <p style={subtleTextStyle}>
              These records power the public services list, service detail page, and booking flow.
            </p>
          </div>
          <div style={statsRowStyle}>
            <StatCard label="Total services" value={String(services.length)} />
            <StatCard label="Visible in catalog" value={String(services.length)} />
          </div>
        </section>

        <div style={gridStyle}>
          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <h3 style={panelTitleStyle}>{editingId ? "Edit Service" : "Add New Service"}</h3>
                <p style={panelDescriptionStyle}>
                  Fill in the service details that customers will see before they book.
                </p>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} style={secondaryButtonStyle}>
                  Cancel edit
                </button>
              )}
            </div>

            {feedback.message && (
              <div style={feedbackStyle(feedback.type)}>
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={formGridStyle}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Service title</span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Wedding planning"
                  style={inputStyle}
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Category</span>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Weddings"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Price</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2500"
                  style={inputStyle}
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Duration</span>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="6 hours"
                  style={inputStyle}
                />
              </label>

              <label style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Image URL</span>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={inputStyle}
                />
              </label>

              <label style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Short description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the service in a few clear lines."
                  style={textareaStyle}
                  rows={4}
                  required
                />
              </label>

              <label style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Included details</span>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  placeholder="Planning consultation, vendor coordination, venue styling..."
                  style={textareaStyle}
                  rows={5}
                />
              </label>

              <div style={{ display: "flex", gap: 12, gridColumn: "1 / -1", flexWrap: "wrap" }}>
                <button type="submit" disabled={saving} style={primaryButtonStyle}>
                  {saving ? "Saving..." : editingId ? "Update service" : "Create service"}
                </button>
                <button type="button" onClick={resetForm} style={secondaryButtonStyle}>
                  Clear form
                </button>
              </div>
            </form>
          </section>

          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <h3 style={panelTitleStyle}>Current Services</h3>
                <p style={panelDescriptionStyle}>Search and manage every service currently shown in the app.</p>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services"
                style={{ ...inputStyle, width: 220 }}
              />
            </div>

            {loading && <div style={emptyStateStyle}>Loading services...</div>}
            {!loading && filteredServices.length === 0 && (
              <div style={emptyStateStyle}>No services matched your current search.</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredServices.map((service) => (
                <article key={service._id} style={serviceCardStyle}>
                  <div style={serviceCardTopStyle}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={serviceNameRowStyle}>
                        <h4 style={serviceNameStyle}>{service.title}</h4>
                        <span style={pillStyle}>{service.category || "Event"}</span>
                      </div>
                      <p style={serviceDescriptionStyle}>{service.description || "No description provided."}</p>
                      <div style={metaRowStyle}>
                        <span>{formatPrice(service.price)}</span>
                        <span>{service.duration || "Flexible duration"}</span>
                      </div>
                    </div>
                    {service.image ? (
                      <img src={service.image} alt={service.title} style={previewImageStyle} />
                    ) : (
                      <div style={imagePlaceholderStyle}>No image</div>
                    )}
                  </div>

                  {service.details && <div style={detailsStyle}>{service.details}</div>}

                  <div style={actionsRowStyle}>
                    <button type="button" onClick={() => startEdit(service)} style={secondaryButtonStyle}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(service)} style={dangerButtonStyle}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={statCardStyle}>
      <div style={statValueStyle}>{value}</div>
      <div style={statLabelStyle}>{label}</div>
    </div>
  );
}

function formatPrice(price) {
  if (price === undefined || price === null || price === "") return "Price pending";
  const amount = Number(price);
  if (Number.isNaN(amount)) return `$${price}`;
  return `$${amount.toLocaleString()}`;
}

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const heroCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
  background: "linear-gradient(135deg, #fffaf4 0%, #ffffff 45%, #f6fbff 100%)",
  borderRadius: 18,
  padding: 28,
  border: "1px solid rgba(240, 194, 165, 0.45)",
  boxShadow: "0 14px 34px rgba(56, 79, 110, 0.08)",
};

const eyebrowStyle = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 1.2,
  color: "#b16f4f",
  fontWeight: 700,
  marginBottom: 10,
};

const headlineStyle = {
  margin: 0,
  fontSize: 30,
  lineHeight: 1.2,
  color: "#243447",
  maxWidth: 620,
  fontFamily: "'Abril Fatface', serif",
};

const subtleTextStyle = {
  margin: "10px 0 0 0",
  color: "#66707a",
  fontSize: 15,
  maxWidth: 560,
};

const statsRowStyle = {
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const statCardStyle = {
  minWidth: 150,
  padding: "18px 20px",
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid rgba(188, 214, 235, 0.65)",
};

const statValueStyle = {
  fontSize: 30,
  fontWeight: 800,
  color: "#243447",
};

const statLabelStyle = {
  fontSize: 13,
  color: "#66707a",
  marginTop: 6,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 24,
  alignItems: "start",
};

const panelStyle = {
  background: "rgba(255, 255, 255, 0.94)",
  borderRadius: 18,
  padding: 24,
  border: "1px solid rgba(202, 214, 228, 0.75)",
  boxShadow: "0 12px 28px rgba(56, 79, 110, 0.08)",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 18,
};

const panelTitleStyle = {
  margin: 0,
  color: "#243447",
  fontSize: 22,
};

const panelDescriptionStyle = {
  margin: "6px 0 0 0",
  color: "#66707a",
  fontSize: 14,
};

const feedbackStyle = (type) => ({
  marginBottom: 18,
  padding: "12px 14px",
  borderRadius: 12,
  fontSize: 14,
  background: type === "error" ? "#fff0ee" : "#eef8f2",
  color: type === "error" ? "#b54d3f" : "#1e7a4f",
  border: `1px solid ${type === "error" ? "rgba(214, 93, 72, 0.2)" : "rgba(30, 122, 79, 0.2)"}`,
});

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#3f4b59",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d7e1ea",
  background: "#f9fbfc",
  color: "#243447",
  fontSize: 14,
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 110,
  fontFamily: "inherit",
};

const primaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #dd6b4d 0%, #f2a65a 100%)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "1px solid #d7e1ea",
  background: "#fff",
  color: "#243447",
  fontWeight: 700,
  cursor: "pointer",
};

const dangerButtonStyle = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "1px solid rgba(192, 71, 61, 0.15)",
  background: "#fff1ef",
  color: "#b94b40",
  fontWeight: 700,
  cursor: "pointer",
};

const emptyStateStyle = {
  padding: 20,
  borderRadius: 14,
  background: "#f9fbfc",
  color: "#66707a",
  border: "1px dashed #d7e1ea",
  textAlign: "center",
};

const serviceCardStyle = {
  borderRadius: 16,
  border: "1px solid #e2e9ef",
  background: "#ffffff",
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const serviceCardTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const serviceNameRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 8,
};

const serviceNameStyle = {
  margin: 0,
  color: "#243447",
  fontSize: 18,
};

const pillStyle = {
  padding: "5px 10px",
  borderRadius: 999,
  background: "#eef5fb",
  color: "#46627c",
  fontSize: 12,
  fontWeight: 700,
};

const serviceDescriptionStyle = {
  margin: 0,
  color: "#66707a",
  fontSize: 14,
  lineHeight: 1.5,
};

const metaRowStyle = {
  marginTop: 12,
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
  color: "#46627c",
  fontSize: 13,
  fontWeight: 700,
};

const previewImageStyle = {
  width: 116,
  height: 96,
  borderRadius: 12,
  objectFit: "cover",
  border: "1px solid #e2e9ef",
};

const imagePlaceholderStyle = {
  width: 116,
  height: 96,
  borderRadius: 12,
  border: "1px dashed #d7e1ea",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#91a0ae",
  fontSize: 13,
  background: "#f9fbfc",
};

const detailsStyle = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#f9fbfc",
  color: "#5a6672",
  fontSize: 13,
  lineHeight: 1.5,
  border: "1px solid #e2e9ef",
};

const actionsRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
};

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminComponents/AdminLayout";
import { createTimeslot, deleteTimeslot, fetchAllTimeslots, updateTimeslot } from "../api";

const emptyForm = {
  date: "",
  timesText: "",
  is_active: true,
};

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminTimeSlots() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    loadTimeslots();
  }, []);

  async function loadTimeslots() {
    setLoading(true);
    try {
      const data = await fetchAllTimeslots();
      setSlots(Array.isArray(data) ? data : []);
    } catch (error) {
      setSlots([]);
      setFeedback({ type: "error", message: error.message || "Failed to load timeslots" });
    } finally {
      setLoading(false);
    }
  }

  const filteredSlots = useMemo(() => {
    let output = [...slots];

    if (filter === "active") output = output.filter((slot) => slot.is_active);
    if (filter === "inactive") output = output.filter((slot) => !slot.is_active);
    if (filter === "booked") output = output.filter((slot) => (slot.booked_times || []).length > 0);

    const query = search.trim().toLowerCase();
    if (!query) return output;

    return output.filter((slot) =>
      [slot.date, slot.display_date, ...(slot.times || []), ...(slot.booked_times || [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [slots, search, filter]);

  const activeSlotCount = slots.filter((slot) => slot.is_active).length;
  const configuredTimeCount = slots.reduce((count, slot) => count + (slot.times || []).length, 0);
  const todayValue = getTodayInputValue();

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function startEdit(slot) {
    setEditingId(slot._id);
    setForm({
      date: slot.date || "",
      timesText: (slot.times || []).join(", "),
      is_active: Boolean(slot.is_active),
    });
    setFeedback({ type: "", message: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.date && form.date < todayValue) {
      setFeedback({ type: "error", message: "Please choose today or a future date." });
      return;
    }

    setSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        date: form.date,
        times: splitTimes(form.timesText),
        is_active: form.is_active,
      };

      if (editingId) {
        await updateTimeslot(editingId, payload);
        setFeedback({ type: "success", message: "Timeslot updated successfully." });
      } else {
        await createTimeslot(payload);
        setFeedback({ type: "success", message: "Timeslot created successfully." });
      }

      resetForm();
      await loadTimeslots();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to save timeslot" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slot) {
    const confirmed = window.confirm(`Delete the ${slot.display_date || slot.date} timeslot entry?`);
    if (!confirmed) return;

    setFeedback({ type: "", message: "" });
    try {
      await deleteTimeslot(slot._id);
      if (editingId === slot._id) {
        resetForm();
      }
      setFeedback({ type: "success", message: "Timeslot deleted successfully." });
      await loadTimeslots();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to delete timeslot" });
    }
  }

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <section style={heroCardStyle}>
          <div>
            <div style={eyebrowStyle}>Availability control</div>
            <h2 style={headlineStyle}>Manage booking dates and time windows before customers pick them.</h2>
            <p style={subtleTextStyle}>
              Active slots appear in the customer booking form. Booked times are protected from accidental removal.
            </p>
          </div>
          <div style={statsRowStyle}>
            <StatCard label="Dates configured" value={String(slots.length)} />
            <StatCard label="Active dates" value={String(activeSlotCount)} />
            <StatCard label="Total times" value={String(configuredTimeCount)} />
          </div>
        </section>

        <div style={gridStyle}>
          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <h3 style={panelTitleStyle}>{editingId ? "Edit Date and Time" : "Add New Date and Time"}</h3>
                <p style={panelDescriptionStyle}>
                  Add one date per record and list all available times separated by commas.
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Date</span>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  min={todayValue}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Times</span>
                <textarea
                  name="timesText"
                  value={form.timesText}
                  onChange={handleChange}
                  placeholder="09:00 AM, 01:00 PM, 05:30 PM"
                  rows={5}
                  style={textareaStyle}
                  required
                />
              </label>

              <label style={toggleRowStyle}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: "#0f6cbd" }}
                />
                <span style={{ color: "#243447", fontWeight: 700 }}>Visible to customers</span>
              </label>

              <div style={{ color: "#66707a", fontSize: 13, lineHeight: 1.5 }}>
                Enter times in the exact labels you want users to see. Example: `10:00 AM, 02:30 PM`.
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button type="submit" disabled={saving} style={primaryButtonStyle}>
                  {saving ? "Saving..." : editingId ? "Update timeslot" : "Create timeslot"}
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
                <h3 style={panelTitleStyle}>Scheduled Availability</h3>
                <p style={panelDescriptionStyle}>Review active dates, inactive dates, and booked times in one view.</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <select value={filter} onChange={(event) => setFilter(event.target.value)} style={inputStyle}>
                  <option value="all">All dates</option>
                  <option value="active">Active only</option>
                  <option value="inactive">Inactive only</option>
                  <option value="booked">Has bookings</option>
                </select>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search dates or times"
                  style={{ ...inputStyle, width: 210 }}
                />
              </div>
            </div>

            {loading && <div style={emptyStateStyle}>Loading timeslots...</div>}
            {!loading && filteredSlots.length === 0 && (
              <div style={emptyStateStyle}>No timeslots matched your current filters.</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredSlots.map((slot) => {
                const bookedTimes = slot.booked_times || [];
                const openTimes = (slot.times || []).filter((time) => !bookedTimes.includes(time));

                return (
                  <article key={slot._id} style={slotCardStyle}>
                    <div style={slotHeaderStyle}>
                      <div>
                        <div style={slotDateRowStyle}>
                          <h4 style={slotDateStyle}>{slot.display_date || slot.date}</h4>
                          <span style={statusPillStyle(slot.is_active)}>
                            {slot.is_active ? "Active" : "Hidden"}
                          </span>
                        </div>
                        <div style={slotDateMetaStyle}>{slot.date}</div>
                      </div>
                      <div style={slotActionRowStyle}>
                        <button type="button" onClick={() => startEdit(slot)} style={secondaryButtonStyle}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(slot)} style={dangerButtonStyle}>
                          Delete
                        </button>
                      </div>
                    </div>

                    <div style={slotStatsRowStyle}>
                      <MiniStat label="Configured" value={String((slot.times || []).length)} />
                      <MiniStat label="Open" value={String(openTimes.length)} />
                      <MiniStat label="Booked" value={String(bookedTimes.length)} />
                    </div>

                    <div style={chipGroupWrapStyle}>
                      <div>
                        <div style={chipGroupLabelStyle}>Configured times</div>
                        <div style={chipsRowStyle}>
                          {(slot.times || []).map((time) => (
                            <span key={`${slot._id}-${time}`} style={configuredChipStyle}>
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>

                      {bookedTimes.length > 0 && (
                        <div>
                          <div style={chipGroupLabelStyle}>Already booked</div>
                          <div style={chipsRowStyle}>
                            {bookedTimes.map((time) => (
                              <span key={`${slot._id}-booked-${time}`} style={bookedChipStyle}>
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
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

function MiniStat({ label, value }) {
  return (
    <div style={miniStatStyle}>
      <div style={miniStatValueStyle}>{value}</div>
      <div style={miniStatLabelStyle}>{label}</div>
    </div>
  );
}

function splitTimes(value) {
  return value
    .split(/[\n,]+/)
    .map((time) => time.trim())
    .filter(Boolean);
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
  background: "linear-gradient(135deg, #f5fcfa 0%, #ffffff 45%, #f9f7ff 100%)",
  borderRadius: 18,
  padding: 28,
  border: "1px solid rgba(142, 196, 182, 0.45)",
  boxShadow: "0 14px 34px rgba(49, 81, 72, 0.08)",
};

const eyebrowStyle = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 1.2,
  color: "#2f7c69",
  fontWeight: 700,
  marginBottom: 10,
};

const headlineStyle = {
  margin: 0,
  fontSize: 30,
  lineHeight: 1.2,
  color: "#243447",
  maxWidth: 650,
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
  minWidth: 138,
  padding: "18px 20px",
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid rgba(180, 210, 221, 0.8)",
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
  minHeight: 120,
  fontFamily: "inherit",
};

const toggleRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const primaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #0f6cbd 0%, #2f7c69 100%)",
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

const feedbackStyle = (type) => ({
  marginBottom: 18,
  padding: "12px 14px",
  borderRadius: 12,
  fontSize: 14,
  background: type === "error" ? "#fff0ee" : "#eef8f2",
  color: type === "error" ? "#b54d3f" : "#1e7a4f",
  border: `1px solid ${type === "error" ? "rgba(214, 93, 72, 0.2)" : "rgba(30, 122, 79, 0.2)"}`,
});

const emptyStateStyle = {
  padding: 20,
  borderRadius: 14,
  background: "#f9fbfc",
  color: "#66707a",
  border: "1px dashed #d7e1ea",
  textAlign: "center",
};

const slotCardStyle = {
  borderRadius: 16,
  border: "1px solid #e2e9ef",
  background: "#ffffff",
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const slotHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const slotDateRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const slotDateStyle = {
  margin: 0,
  color: "#243447",
  fontSize: 18,
};

const slotDateMetaStyle = {
  color: "#7c8895",
  fontSize: 13,
  marginTop: 6,
};

const statusPillStyle = (isActive) => ({
  padding: "5px 10px",
  borderRadius: 999,
  background: isActive ? "#ebf8f3" : "#f2f4f7",
  color: isActive ? "#1e7a4f" : "#66707a",
  fontSize: 12,
  fontWeight: 700,
});

const slotActionRowStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const slotStatsRowStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const miniStatStyle = {
  minWidth: 96,
  padding: "12px 14px",
  borderRadius: 12,
  background: "#f9fbfc",
  border: "1px solid #e2e9ef",
};

const miniStatValueStyle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#243447",
};

const miniStatLabelStyle = {
  marginTop: 4,
  color: "#66707a",
  fontSize: 12,
};

const chipGroupWrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const chipGroupLabelStyle = {
  color: "#3f4b59",
  fontWeight: 700,
  fontSize: 13,
  marginBottom: 8,
};

const chipsRowStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const configuredChipStyle = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "#eef5fb",
  color: "#46627c",
  fontSize: 13,
  fontWeight: 700,
};

const bookedChipStyle = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "#fff1ef",
  color: "#b94b40",
  fontSize: 13,
  fontWeight: 700,
};

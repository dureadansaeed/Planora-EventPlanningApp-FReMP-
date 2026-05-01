export default function ServicesSearchBar({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFiltersChange,
}) {

  const filters = [
    { label: "Corporate" },
    { label: "Wedding" },
    { label: "Birthday" },
    { label: "Business" },
    { label: "Concert" },
    { label: "Workshop" },
  ];

  const toggleFilter = (label) => {
    if (selectedFilters.includes(label)) {
      onFiltersChange(selectedFilters.filter((f) => f !== label));
      return;
    }
    onFiltersChange([...selectedFilters, label]);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255,182,193,0.2)",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* search icon removed; input placeholder indicates purpose */}
        <input
          type="text"
          placeholder="Search services"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 14,
            fontFamily: "'Arimo', sans-serif",
            color: "#6B6B6B",
            background: "transparent",
          }}
        />
      </div>

      {/* Filter Pills */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => toggleFilter(filter.label)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: selectedFilters.includes(filter.label)
                ? "#FFB6C1"
                : "rgba(255,182,193,0.1)",
              color: selectedFilters.includes(filter.label)
                ? "white"
                : "#6B6B6B",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Arimo', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              if (!selectedFilters.includes(filter.label)) {
                e.target.style.background = "rgba(255,182,193,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!selectedFilters.includes(filter.label)) {
                e.target.style.background = "rgba(255,182,193,0.1)";
              }
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Shown for missing sites and for free-plan previews viewed by anyone but their owner. */
export default function SiteNotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#fafaf9",
        color: "#151513",
        font: "15px/1.6 ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>This site isn&rsquo;t available</h1>
        <p style={{ margin: "8px 0 0", color: "#55534e" }}>It may be a private preview, or the link may be out of date.</p>
      </div>
    </main>
  );
}

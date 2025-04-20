export function Button({ url, text }: { url: string; text: string }) {
  const origin =
    process.env.NODE_ENV === "production"
      ? "https://training.olinfo.it"
      : `http://localhost:${process.env.PORT ?? 3000}`;

  const href = new URL(url, origin).href;

  return (
    <div style={{ width: "100%" }}>
      <a
        href={href}
        style={{
          backgroundColor: "#65c3c8",
          borderRadius: "8px",
          color: "#030e0f",
          display: "block",
          fontWeight: "bold",
          lineHeight: "40px",
          margin: "auto",
          textAlign: "center",
          textDecoration: "none",
          width: "200px",
        }}>
        {text}
      </a>
    </div>
  );
}

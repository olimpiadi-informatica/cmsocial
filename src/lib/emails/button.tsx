export function Button({ url, text }: { url: string; text: string }) {
  return (
    <div style={{ width: "100%" }}>
      <a
        href={url}
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

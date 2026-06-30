"use client";

export default function BackToTop() {
  return (
    <a
      href="#"
      aria-label="Back to top"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="gd-back-to-top"
      style={{
        position: "fixed",
        bottom: "40px",
        right: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink)",
      }}
    >
      {/* Material Icons: arrow_upward */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
      </svg>
    </a>
  );
}

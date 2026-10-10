// The big opening statement at the top of a page (Work, About): the page's one
// h1, set as the case studies' hero text, 80px from the nav (the same start as the home intro). marginBottom is
// the space under it (Work: 128 before the list; About: 32, since the first row
// under it carries its own 96 top margin, which makes the same 128).
export default function PageStatement({
  children,
  marginBottom = "var(--gd-statement-gap)",
}: {
  children: React.ReactNode;
  marginBottom?: string;
}) {
  return (
    <div className="gd-container">
      <h1
        style={{
          maxWidth: "calc(960 * var(--u))",
          marginTop: "calc(80 * var(--u))",
          marginBottom,
          fontSize: "var(--type-display)",
          lineHeight: 1.2,
          fontWeight: 500,
          letterSpacing: "-0.006em",
          color: "var(--ink)",
          textWrap: "pretty",
        }}
      >
        {children}
      </h1>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

type Project = {
  _uid: string;
  title: string;
  discipline: string;
  slug: string;
  image: { filename: string; alt: string };
};

export default function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "2px",
        marginTop: "48px",
      }}
    >
      {projects.map((p) => (
        <Link
          key={p._uid}
          href={`/work/${p.slug}`}
          style={{
            display: "block",
            position: "relative",
            aspectRatio: "4/3",
            overflow: "hidden",
            background: "var(--grey-100)",
          }}
        >
          {p.image?.filename && (
            <Image
              src={p.image.filename}
              alt={p.image.alt || p.title}
              fill
              style={{ objectFit: "cover" }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "16px",
              background:
                "linear-gradient(to top, rgba(35,31,32,0.6) 0%, transparent 60%)",
              color: "var(--white)",
            }}
          >
            <span
              style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "4px" }}
            >
              {p.discipline}
            </span>
            <span style={{ fontSize: "1rem", fontWeight: 500 }}>{p.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

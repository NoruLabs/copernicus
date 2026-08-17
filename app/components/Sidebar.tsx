import Image from "next/image";
import Link from "next/link";
import OrbitDotMotion from "../../components/pixel-perfect/orbit-dot-motion";

type IconName = "apod" | "near" | "planets" | "images" | "canvas";

const items: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/apod", label: "APOD", icon: "apod" },
  { href: "/near-earth", label: "Near Earth", icon: "near" },
  { href: "/exoplanets", label: "Exoplanets", icon: "planets" },
  { href: "/image-library", label: "Image Library", icon: "images" },
  { href: "/canvas", label: "Canvas", icon: "canvas" },
];

function NavIcon({ name }: { name: IconName }) {
  if (name === "near") return <OrbitDotMotion />;
  if (name === "canvas") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="3.5" width="16" height="17" />
        <path d="m7 16 3.5-4 2.5 2.5 2.2-2.2L18 16M8 8h.01" />
      </svg>
    );
  }

  const source =
    name === "apod"
      ? "/icon-camera.png"
      : name === "planets"
        ? "/icon-earth.png"
        : "/icon-gallery.png";

  return (
    <Image
      alt=""
      aria-hidden="true"
      className="nav-image-icon"
      height={24}
      src={source}
      width={24}
    />
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="sidebar-brand" href="/" aria-label="Copernicus home">
        <span className="brand-name">Copernicus</span>
      </Link>

      <nav className="feature-nav" aria-label="Features">
        {items.map((item) => (
          <a
            aria-label={item.label}
            className="nav-item"
            href={item.href}
            key={item.href}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

type IconName = "home" | "apod" | "near" | "planets" | "images";

const items: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "#home", label: "Home", icon: "home" },
  { href: "#apod", label: "APOD", icon: "apod" },
  { href: "#near-earth", label: "Near Earth", icon: "near" },
  { href: "#exoplanets", label: "Exoplanets", icon: "planets" },
  { href: "#images", label: "Image Library", icon: "images" },
];

function NavIcon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {name === "home" ? (
        <>
          <path {...common} d="m3.5 10 8.5-7 8.5 7" />
          <path {...common} d="M5.5 9v11h13V9M9.5 20v-6h5v6" />
        </>
      ) : null}
      {name === "apod" ? (
        <>
          <circle {...common} cx="12" cy="12" r="8.5" />
          <path {...common} d="m12 6 .8 3.2L16 10l-3.2.8L12 14l-.8-3.2L8 10l3.2-.8L12 6Z" />
        </>
      ) : null}
      {name === "near" ? (
        <>
          <circle {...common} cx="12" cy="12" r="3" />
          <path {...common} d="M4 14.5C6.5 8.2 13.5 4 20 5.5" />
          <path {...common} d="M5 18c5.5 1.7 11.2-.7 14-5" />
        </>
      ) : null}
      {name === "planets" ? (
        <>
          <circle {...common} cx="12" cy="12" r="5" />
          <path {...common} d="M3 14.5c2.8 2.3 8.3 2.5 13.2.3 4.3-1.9 5.9-4.7 3.6-6.2-1.4-.9-3.8-.8-6.3.1" />
        </>
      ) : null}
      {name === "images" ? (
        <>
          <rect {...common} x="3.5" y="4" width="17" height="16" />
          <circle {...common} cx="9" cy="9" r="1.5" />
          <path {...common} d="m5.5 17 4.2-4 3 2.6 2.6-2.2 3.2 3.6" />
        </>
      ) : null}
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="#home" aria-label="Copernicus home">
        <span className="brand-mark">C</span>
        <span className="brand-name">Copernicus</span>
      </a>

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

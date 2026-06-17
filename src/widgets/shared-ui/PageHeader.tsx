interface PageHeaderProps {
  title: string;
  highlight?: string;
  label?: string;
  subtitle?: string;
}

export default function PageHeader({ title, highlight, label, subtitle }: PageHeaderProps) {
  return (
    <div>
      {label && (
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      )}
      <h1 className="text-2xl font-semibold" style={{ color: "var(--text-default)" }}>
        {title}
        {highlight && (
          <>
            {" "}
            <span style={{ color: "var(--color-blue)" }}>{highlight}</span>
          </>
        )}
      </h1>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

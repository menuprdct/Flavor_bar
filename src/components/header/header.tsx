'use client';


interface MenuHeaderProps {
  logoUrl?: string;
  title?: string;
  subtitle?: string;
}

export default function MenuHeader({
  logoUrl,
  title,
  subtitle,
}: MenuHeaderProps) {
  return (
    <header className="w-full px-4 py-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b">
      <div className="flex items-center gap-3 text-center md:text-left">
        <img
          src={logoUrl}
          alt="Menu Logo"
          width={50}
          height={50}
          className="rounded-xl shadow-md"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

import { ReactNode } from "react";

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function SectionContainer({
  id,
  className = "",
  children,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`px-6 sm:px-12 md:px-16 lg:px-20 xl:px-28 py-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

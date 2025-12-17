// Section.tsx - Section wrapper
interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      {children}
    </section>
  );
}
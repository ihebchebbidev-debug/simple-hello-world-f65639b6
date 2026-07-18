import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 text-section font-extrabold text-ink">{title}</h2>
      {description && <p className="mt-3 text-lg leading-relaxed text-ink/65">{description}</p>}
    </motion.div>
  );
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn('py-10 md:py-14', className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

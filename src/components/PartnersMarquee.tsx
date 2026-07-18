import p1 from '@/assets/partners/partner-1.png';
import p2 from '@/assets/partners/partner-2.png';
import p3 from '@/assets/partners/partner-3.png';
import p4 from '@/assets/partners/partner-4.png';
import p5 from '@/assets/partners/partner-5.png';
import p6 from '@/assets/partners/partner-6.png';
import p7 from '@/assets/partners/partner-7.png';
import p8 from '@/assets/partners/partner-8.png';
import p9 from '@/assets/partners/partner-9.png';
import p10 from '@/assets/partners/partner-10.png';
import p11 from '@/assets/partners/partner-11.png';

const PARTNERS = [
  { src: p1,  alt: 'Sipcam Inagra' },
  { src: p2,  alt: 'Bayer CropScience' },
  { src: p3,  alt: 'Tradecorp' },
  { src: p4,  alt: 'Belchim Crop Protection' },
  { src: p5,  alt: 'Manica' },
  { src: p6,  alt: 'Monsanto' },
  { src: p7,  alt: 'De Sangosse' },
  { src: p8,  alt: 'FMC' },
  { src: p9,  alt: 'Nufarm' },
  { src: p10, alt: 'Partenaire' },
  { src: p11, alt: 'Gowan' },
];

export default function PartnersMarquee() {
  // Duplicate the list so translateX(-50%) produces a seamless loop.
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
      }}
      aria-label="Partenaires internationaux"
    >
      <div data-partners-marquee className="flex w-max items-center gap-8 py-1 sm:gap-12 md:gap-16">
        {loop.map((p, i) => (
          <div
            key={i}
            className="flex h-10 shrink-0 items-center justify-center sm:h-12 md:h-14"
            aria-hidden={i >= PARTNERS.length ? true : undefined}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              draggable={false}
              className="h-full w-auto max-w-[110px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:max-w-[130px] md:max-w-[150px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

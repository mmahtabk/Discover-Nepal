import { Link } from 'react-router-dom';
import type { Province } from '../../types';

export function ProvinceCard({ province }: { province: Province }) {
  return (
    <Link
      to={`/provinces/${province.slug}`}
      className="group block overflow-hidden rounded-2xl border border-stone-2 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={province.imageUrl}
          alt={province.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
          Province {province.number}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-bold text-ink">
          {province.name} <span className="font-sans font-normal text-muted">{province.nameNepali}</span>
        </h3>
        <p className="mt-1 text-sm text-muted">Capital · {province.capital}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/80">{province.description}</p>
      </div>
    </Link>
  );
}
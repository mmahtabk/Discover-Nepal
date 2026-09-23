import { Link, NavLink } from 'react-router-dom';

const tabs = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/destinations', label: 'Destinations' },
  { to: '/admin/provinces', label: 'Provinces' },
  { to: '/admin/inquiries', label: 'Inquiries' },
];

export function AdminNav() {
  return (
    <div className="border-b border-stone-2 bg-forest/5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold">
          <span className="mr-2 rounded-full bg-forest px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Admin
          </span>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-forest px-3 py-1.5 text-white'
                  : 'rounded-full px-3 py-1.5 text-ink hover:bg-mint'
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="text-sm font-medium text-muted hover:text-forest">
          ← View site
        </Link>
      </div>
    </div>
  );
}
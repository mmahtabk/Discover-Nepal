import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as L from 'leaflet';
import { useDestinations } from '../hooks/useDestinations';
import { Loader } from '../components/ui/Loader';
import { CATEGORY_COLORS, haversineKm, type LatLng } from '../lib/geo';
import type { Category, Destination } from '../types';

const NEPAL_CENTER: LatLng = { lat: 28.2, lng: 84.5 };
const NEPAL_ZOOM = 7;
const KATHMANDU: LatLng = { lat: 27.7172, lng: 85.324 };

function categoryKey(c: Category): string {
  return c === 'hidden-gem' ? 'categories.hiddenGem' : `categories.${c}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function provinceName(destination: Destination): string {
  if (destination.provinceId && typeof destination.provinceId === 'object') {
    return 'name' in destination.provinceId ? destination.provinceId.name : 'Nepal';
  }
  return 'Nepal';
}

export default function MapPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const focusSlug = searchParams.get('d') ?? undefined;

  const { destinations, loading, error } = useDestinations();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pinsLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const handledFocusRef = useRef<string | null>(null);

  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [fallbackLoc, setFallbackLoc] = useState(false);

  useEffect(() => {
    if (loading || !containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: NEPAL_CENTER, zoom: NEPAL_ZOOM });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    const pinsLayer = L.layerGroup().addTo(map);
    const userLayer = L.layerGroup().addTo(map);
    mapRef.current = map;
    pinsLayerRef.current = pinsLayer;
    userLayerRef.current = userLayer;
    const invalidate = () => map.invalidateSize();
    requestAnimationFrame(invalidate);
    setTimeout(invalidate, 250);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [loading]);

  useEffect(() => {
    const map = mapRef.current;
    const pinsLayer = pinsLayerRef.current;
    if (!map || !pinsLayer) return;
    const popupHtml = (d: Destination): string => {
      const color = CATEGORY_COLORS[d.category];
      const label = escapeHtml(t(categoryKey(d.category)));
      return (
        '<div style="min-width:180px">' +
        `<p style="margin:0 0 2px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${color}">${label}</p>` +
        `<strong style="display:block;line-height:1.2">${escapeHtml(d.name)}</strong>` +
        `<p style="margin:2px 0 6px;font-size:12px;color:#6b7280">${escapeHtml(provinceName(d))} · ${escapeHtml(d.district)}</p>` +
        `<a href="/destinations/${encodeURIComponent(d.slug)}" ` +
        `style="font-size:13px;font-weight:600;color:#1a5c3a;text-decoration:underline">${escapeHtml(t('map.openDetail'))} →</a>` +
        '</div>'
      );
    };
    pinsLayer.clearLayers();
    const markerMap = new Map<string, L.CircleMarker>();
    for (const d of destinations) {
      if (typeof d.lat !== 'number' || typeof d.lng !== 'number') continue;
      const marker = L.circleMarker([d.lat, d.lng], {
        radius: 7,
        color: '#ffffff',
        weight: 2,
        fillColor: CATEGORY_COLORS[d.category],
        fillOpacity: 1,
      });
      marker.bindPopup(popupHtml(d));
      marker.addTo(pinsLayer);
      markerMap.set(d.slug, marker);
    }
    markersRef.current = markerMap;
  }, [destinations, t]);

  useEffect(() => {
    const map = mapRef.current;
    const userLayer = userLayerRef.current;
    if (!map || !userLayer) return;
    userLayer.clearLayers();
    if (!userLoc) return;
    L.circleMarker([userLoc.lat, userLoc.lng], {
      radius: 9,
      color: '#1a5c3a',
      weight: 3,
      fillColor: '#2d7a52',
      fillOpacity: 0.9,
    })
      .bindTooltip(t('map.userMarkerTitle'), { direction: 'top' })
      .addTo(userLayer);
  }, [userLoc, t]);

  useEffect(() => {
    if (!focusSlug || handledFocusRef.current === focusSlug) return;
    const marker = markersRef.current.get(focusSlug);
    const map = mapRef.current;
    if (!marker || !map) return;
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 10));
    marker.openPopup();
    handledFocusRef.current = focusSlug;
  }, [focusSlug, destinations]);

  const nearest = useMemo(() => {
    const origin = userLoc ?? KATHMANDU;
    return destinations
      .filter((d) => typeof d.lat === 'number' && typeof d.lng === 'number')
      .map((d) => ({ d, km: haversineKm(origin, { lat: d.lat, lng: d.lng }) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 10);
  }, [destinations, userLoc]);

  const flyToSlug = (slug: string) => {
    const marker = markersRef.current.get(slug);
    const map = mapRef.current;
    if (!marker || !map) return;
    map.flyTo(marker.getLatLng(), 11);
    marker.openPopup();
  };

  const geolocate = (): Promise<LatLng | null> => {
    if (!('geolocation' in navigator)) return Promise.resolve(null);
    return new Promise((resolve) => {
      const watch = setTimeout(() => resolve(null), 12000);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(watch);
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          clearTimeout(watch);
          resolve(null);
        },
        { timeout: 10000, maximumAge: 0, enableHighAccuracy: false },
      );
    });
  };

  const locate = async () => {
    setLocating(true);
    setLocateError(null);
    const position = await geolocate();
    setLocating(false);
    if (position) {
      setUserLoc(position);
      setFallbackLoc(false);
      return;
    }
    setUserLoc(KATHMANDU);
    setFallbackLoc(true);
    const map = mapRef.current;
    if (map) map.setView(KATHMANDU, 9);
  };

  const hasCoords = destinations.some((d) => typeof d.lat === 'number' && typeof d.lng === 'number');

  if (loading) return <Loader label={t('common.loadingDestinations')} />;

  return (
    <div>
      <header className="border-b border-stone-2 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-forest">
            {t('map.eyebrow')}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-ink">{t('map.title')}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">{t('map.subtitle')}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {error ? (
          <p className="text-muted">{error}</p>
        ) : !hasCoords ? (
          <p className="text-muted">{t('map.noLocate')}</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <div
              ref={containerRef}
              className="relative z-0 h-[560px] w-full overflow-hidden rounded-2xl border border-stone-2 shadow-sm"
            />

            <aside className="space-y-6">
              <section className="rounded-2xl bg-sky-tint p-5">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-sky">
                  {t('map.legendTitle')}
                </h2>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-ink lg:grid-cols-1">
                  {(Object.keys(CATEGORY_COLORS) as Category[]).map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[c] }}
                      />
                      {t(categoryKey(c))}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <button
                  type="button"
                  onClick={locate}
                  disabled={locating}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:brightness-95 disabled:opacity-60"
                >
                  {locating ? t('map.locating') : t('map.locate')}
                </button>
                {fallbackLoc && !locating && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t('map.fallbackNote')}
                  </p>
                )}
                {locateError && <p className="mt-2 text-sm text-error">{t('map.locateError', { message: locateError })}</p>}
                {!userLoc && !locating && !fallbackLoc && (
                  <p className="mt-2 text-xs leading-relaxed text-muted">{t('map.noLocate')}</p>
                )}
              </section>

              {userLoc && (
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {t('map.nearestTitle')}
                  </h2>
                  <ol className="mt-3 space-y-2">
                    {nearest.map(({ d, km }, i) => (
                      <li key={d._id}>
                        <button
                          type="button"
                          onClick={() => flyToSlug(d.slug)}
                          className="flex w-full items-center gap-3 rounded-xl border border-stone-2 bg-white p-3 text-left shadow-sm hover:border-forest/40 hover:shadow"
                        >
                          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-mint text-xs font-bold text-mid">
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">{d.name}</span>
                            <span className="block text-xs text-muted">
                              {provinceName(d)} · {d.district}
                            </span>
                          </span>
                          <span className="flex-none text-xs font-semibold text-forest">
                            {km < 1 ? '<1' : Math.round(km)} km
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
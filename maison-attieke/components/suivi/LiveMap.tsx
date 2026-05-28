'use client'
import { useEffect, useRef } from 'react'

interface Props {
  livreurPos: { lat: number; lng: number } | null
  clientPos:  { lat: number; lng: number } | null
}

export default function LiveMap({ livreurPos, clientPos }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const livMarkerRef = useRef<any>(null)
  const polyRef      = useRef<any>(null)
  const initDone     = useRef(false)

  /* ── icons factory ──────────────────────────────────────── */
  const makeLivIcon = (L: any) => L.divIcon({
    className: '',
    html: `<div style="width:38px;height:38px;border-radius:50%;
      background:linear-gradient(135deg,#22c55e,#16a34a);
      border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.4);
      display:flex;align-items:center;justify-content:center;font-size:19px;">🛵</div>`,
    iconSize: [38, 38], iconAnchor: [19, 19],
  })

  const makeCliIcon = (L: any) => L.divIcon({
    className: '',
    html: `<div style="width:34px;height:34px;border-radius:50%;
      background:linear-gradient(135deg,#f97316,#ea580c);
      border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.4);
      display:flex;align-items:center;justify-content:center;font-size:17px;">📍</div>`,
    iconSize: [34, 34], iconAnchor: [17, 17],
  })

  /* ── init map once ──────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!containerRef.current) return
    if (initDone.current) return           // guard against StrictMode double-fire
    initDone.current = true

    import('leaflet').then(L => {
      // If container already has a Leaflet instance (hot-reload), remove it first
      const el = containerRef.current!
      if ((el as any)._leaflet_id) return

      const center: [number, number] = livreurPos
        ? [livreurPos.lat, livreurPos.lng]
        : clientPos
          ? [clientPos.lat, clientPos.lng]
          : [5.3599517, -4.0082563]   // Abidjan default

      const map = L.map(el, { center, zoom: 15, zoomControl: false, attributionControl: false })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      if (livreurPos) {
        livMarkerRef.current = L.marker([livreurPos.lat, livreurPos.lng], { icon: makeLivIcon(L) })
          .addTo(map).bindPopup('🛵 Livreur')
      }
      if (clientPos) {
        L.marker([clientPos.lat, clientPos.lng], { icon: makeCliIcon(L) })
          .addTo(map).bindPopup('📍 Votre adresse')
      }
      if (livreurPos && clientPos) {
        polyRef.current = L.polyline(
          [[livreurPos.lat, livreurPos.lng], [clientPos.lat, clientPos.lng]],
          { color: '#f97316', weight: 4, opacity: 0.85, dashArray: '8 6' }
        ).addTo(map)
        map.fitBounds(polyRef.current.getBounds(), { padding: [50, 50] })
      }

      mapRef.current = map
    })

    return () => {
      initDone.current = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        livMarkerRef.current = null
        polyRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── update livreur pos live ────────────────────────────── */
  useEffect(() => {
    if (!mapRef.current || !livreurPos) return

    import('leaflet').then(L => {
      const ll: [number, number] = [livreurPos.lat, livreurPos.lng]

      if (livMarkerRef.current) {
        livMarkerRef.current.setLatLng(ll)
      } else {
        livMarkerRef.current = L.marker(ll, { icon: makeLivIcon(L) })
          .addTo(mapRef.current).bindPopup('🛵 Livreur')
      }

      if (clientPos) {
        const pts: [number,number][] = [ll, [clientPos.lat, clientPos.lng]]
        if (polyRef.current) polyRef.current.setLatLngs(pts)
        else polyRef.current = L.polyline(pts, { color: '#f97316', weight: 4, opacity: 0.85, dashArray: '8 6' }).addTo(mapRef.current)
        mapRef.current.fitBounds(polyRef.current.getBounds(), { padding: [50, 50] })
      } else {
        mapRef.current.panTo(ll)
      }
    })
  }, [livreurPos, clientPos])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={containerRef} className="w-full h-full" />
    </>
  )
}

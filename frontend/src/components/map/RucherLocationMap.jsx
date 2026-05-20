import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'

import { DEFAULT_RUCHER_POSITION } from '@/hooks/useRucherLocation'
import { cn } from '@/lib/utils'

const rucherIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function MapEvents({ disabled, onPositionChange }) {
  useMapEvents({
    click(event) {
      if (!disabled) {
        onPositionChange(event.latlng)
      }
    },
  })

  return null
}

function RecenterMap({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 12), { animate: true })
    }
  }, [map, position])

  return null
}

function RucherMarker({ disabled, position, onPositionChange }) {
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current

        if (marker) {
          onPositionChange(marker.getLatLng())
        }
      },
    }),
    [onPositionChange],
  )

  if (!position) {
    return null
  }

  return (
    <Marker
      draggable={!disabled}
      eventHandlers={eventHandlers}
      icon={rucherIcon}
      position={position}
      ref={markerRef}
    />
  )
}

export function RucherLocationMap({
  className,
  disabled = false,
  position,
  onPositionChange = () => {},
}) {
  const center = position ?? DEFAULT_RUCHER_POSITION

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-muted', className)}>
      <MapContainer
        center={center}
        className="h-full min-h-72 w-full"
        scrollWheelZoom
        zoom={position ? 13 : 6}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents disabled={disabled} onPositionChange={onPositionChange} />
        <RecenterMap position={position} />
        <RucherMarker disabled={disabled} position={position} onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  )
}

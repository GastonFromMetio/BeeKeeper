import { useState } from 'react'
import { RucherLocationMap } from '@/components/map/RucherLocationMap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCoordinate, getRucherPosition } from '@/hooks/useRucherLocation'

const emptyRucher = {
  name: '',
  localisation: '',
  latitude: '',
  longitude: '',
  description: '',
  nb_emplacements: 0,
}

function buildInitialRucher(initialValues) {
  return {
    ...emptyRucher,
    ...initialValues,
    latitude: initialValues?.latitude ?? '',
    longitude: initialValues?.longitude ?? '',
    description: initialValues?.description ?? '',
  }
}

export function RucherForm({ initialValues = emptyRucher, onSubmit, submitLabel = 'Enregistrer' }) {
  const [form, setForm] = useState(() => buildInitialRucher(initialValues))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const position = getRucherPosition(form)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === 'nb_emplacements' ? Number(value) : value,
    }))
  }

  function updatePosition(nextPosition) {
    setForm((current) => ({
      ...current,
      latitude: formatCoordinate(nextPosition.lat),
      longitude: formatCoordinate(nextPosition.lng),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      await onSubmit(form)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="rucher-name">Nom</Label>
        <Input id="rucher-name" name="name" value={form.name} onChange={updateField} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="localisation">Localisation</Label>
        <Input id="localisation" name="localisation" value={form.localisation} onChange={updateField} required />
      </div>
      <div className="space-y-2">
        <Label>Position GPS</Label>
        <RucherLocationMap className="h-72" position={position} onPositionChange={updatePosition} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              min="-90"
              max="90"
              step="0.000001"
              value={form.latitude}
              onChange={updateField}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              min="-180"
              max="180"
              step="0.000001"
              value={form.longitude}
              onChange={updateField}
              required
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nb_emplacements">Emplacements</Label>
        <Input
          id="nb_emplacements"
          name="nb_emplacements"
          type="number"
          min="0"
          value={form.nb_emplacements}
          onChange={updateField}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={form.description ?? ''} onChange={updateField} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : submitLabel}
      </Button>
    </form>
  )
}

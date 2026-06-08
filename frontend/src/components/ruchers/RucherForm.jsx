import { useState } from 'react'
import { RucherLocationMap } from '@/components/map/RucherLocationMap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DEFAULT_RUCHER_POSITION,
  formatCoordinate,
  getRucherPosition,
} from '@/hooks/useRucherLocation'
import { useTranslation } from 'react-i18next'

const emptyRucher = {
  name: '',
  latitude: formatCoordinate(DEFAULT_RUCHER_POSITION.lat),
  longitude: formatCoordinate(DEFAULT_RUCHER_POSITION.lng),
  description: '',
  nb_emplacements: 0,
}

function buildInitialRucher(initialValues) {
  const position = getRucherPosition(initialValues) ?? DEFAULT_RUCHER_POSITION

  return {
    ...emptyRucher,
    ...initialValues,
    latitude: formatCoordinate(position.lat),
    longitude: formatCoordinate(position.lng),
    nb_emplacements: initialValues?.nb_emplacements ?? 0,
    description: initialValues?.description ?? '',
  }
}

export function RucherForm({ initialValues = emptyRucher, onSubmit, submitLabel = 'Enregistrer' }) {
  const [form, setForm] = useState(() => buildInitialRucher(initialValues))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useTranslation()
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
        <Label>Position GPS</Label>
        <RucherLocationMap className="h-72" position={position} onPositionChange={updatePosition} />
        <p className="text-xs text-muted-foreground">
          {t('rucher.form.mapHint')}
        </p>
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

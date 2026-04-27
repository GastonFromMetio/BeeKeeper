import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const emptyRucher = {
  name: '',
  localisation: '',
  description: '',
  nb_emplacements: 0,
}

export function RucherForm({ initialValues = emptyRucher, onSubmit, submitLabel = 'Enregistrer' }) {
  const [form, setForm] = useState({ ...emptyRucher, ...initialValues })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === 'nb_emplacements' ? Number(value) : value,
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

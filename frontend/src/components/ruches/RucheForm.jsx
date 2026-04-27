import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const emptyRuche = {
  rucher_id: '',
  name: '',
  statut: 'active',
  type_ruche: '',
  annee_reine: '',
  notes: '',
}

function normalizeInitialValues(values) {
  return {
    ...emptyRuche,
    ...values,
    name: values?.name ?? values?.nom ?? '',
  }
}

export function RucheForm({ ruchers, initialValues = emptyRuche, onSubmit, submitLabel = 'Enregistrer' }) {
  const [form, setForm] = useState(normalizeInitialValues(initialValues))
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
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
        <Label htmlFor="rucher_id">Rucher</Label>
        <select
          id="rucher_id"
          name="rucher_id"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          value={form.rucher_id}
          onChange={updateField}
          required
        >
          <option value="">Choisir un rucher</option>
          {ruchers.map((rucher) => (
            <option key={rucher.id} value={rucher.id}>{rucher.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ruche-name">Nom</Label>
        <Input id="ruche-name" name="name" value={form.name} onChange={updateField} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="statut">Statut</Label>
        <select
          id="statut"
          name="statut"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          value={form.statut}
          onChange={updateField}
        >
          <option value="active">Active</option>
          <option value="en_observation">En observation</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="type_ruche">Type de ruche</Label>
        <Input id="type_ruche" name="type_ruche" value={form.type_ruche} onChange={updateField} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annee_reine">Année reine</Label>
        <Input id="annee_reine" name="annee_reine" type="number" min="2000" value={form.annee_reine ?? ''} onChange={updateField} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" value={form.notes ?? ''} onChange={updateField} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : submitLabel}
      </Button>
    </form>
  )
}

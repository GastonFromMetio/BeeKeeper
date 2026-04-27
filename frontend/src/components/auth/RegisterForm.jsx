import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

function getMessage(error, field) {
  return error?.errors?.[field]?.[0]
}

export function RegisterForm() {
  const { register } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validate() {
    const nextErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = t('validation.required')
    }

    if (!values.email.trim()) {
      nextErrors.email = t('validation.required')
    }

    if (!values.password) {
      nextErrors.password = t('validation.required')
    }

    if (!values.password_confirmation) {
      nextErrors.password_confirmation = t('validation.required')
    }

    if (values.password && values.password.length < 8) {
      nextErrors.password = t('validation.passwordMin')
    }

    if (
      values.password &&
      values.password_confirmation &&
      values.password !== values.password_confirmation
    ) {
      nextErrors.password_confirmation = t('validation.passwordMatch')
    }

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate()
    setFieldErrors(nextErrors)
    setSubmitError(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      setIsSubmitting(true)
      await register(values)
      toast.success(t('auth.registerSuccess'))
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <ApiErrorAlert error={submitError} />

      <div className="space-y-2">
        <Label htmlFor="register-name">{t('auth.name')}</Label>
        <Input
          id="register-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={updateValue}
          placeholder="Alice Martin"
          aria-invalid={Boolean(fieldErrors.name || getMessage(submitError, 'name'))}
        />
        {(fieldErrors.name || getMessage(submitError, 'name')) && (
          <p className="text-sm text-destructive">
            {fieldErrors.name || getMessage(submitError, 'name')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">{t('auth.email')}</Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={updateValue}
          placeholder="alice@example.com"
          aria-invalid={Boolean(fieldErrors.email || getMessage(submitError, 'email'))}
        />
        {(fieldErrors.email || getMessage(submitError, 'email')) && (
          <p className="text-sm text-destructive">
            {fieldErrors.email || getMessage(submitError, 'email')}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="register-password">{t('auth.password')}</Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={updateValue}
            placeholder="password123"
            aria-invalid={Boolean(fieldErrors.password || getMessage(submitError, 'password'))}
          />
          {(fieldErrors.password || getMessage(submitError, 'password')) && (
            <p className="text-sm text-destructive">
              {fieldErrors.password || getMessage(submitError, 'password')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password-confirmation">
            {t('auth.passwordConfirmation')}
          </Label>
          <Input
            id="register-password-confirmation"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            value={values.password_confirmation}
            onChange={updateValue}
            placeholder="password123"
            aria-invalid={Boolean(
              fieldErrors.password_confirmation ||
                getMessage(submitError, 'password_confirmation'),
            )}
          />
          {(fieldErrors.password_confirmation ||
            getMessage(submitError, 'password_confirmation')) && (
            <p className="text-sm text-destructive">
              {fieldErrors.password_confirmation ||
                getMessage(submitError, 'password_confirmation')}
            </p>
          )}
        </div>
      </div>

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        <UserPlus className="size-4" />
        {isSubmitting ? t('auth.creatingAccount') : t('auth.register')}
      </Button>
    </form>
  )
}

import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
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

export function LoginForm() {
  const { login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState({
    email: '',
    password: '',
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

    if (!values.email.trim()) {
      nextErrors.email = t('validation.required')
    }

    if (!values.password) {
      nextErrors.password = t('validation.required')
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
      await login(values)
      toast.success(t('auth.loginSuccess'))
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
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
        <Label htmlFor="login-email">{t('auth.email')}</Label>
        <Input
          id="login-email"
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

      <div className="space-y-2">
        <Label htmlFor="login-password">{t('auth.password')}</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
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

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        <LogIn className="size-4" />
        {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
      </Button>
    </form>
  )
}

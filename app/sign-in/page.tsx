import { Suspense } from 'react'
import SignInForm from './sign-in-form'

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignInForm />
    </Suspense>
  )
}

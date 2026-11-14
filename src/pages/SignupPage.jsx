import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import SignupForm from '../components/auth/SignupForm.jsx'

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to send or review purchase orders."
      footer={
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-medium text-emerald-700 hover:underline">Sign in</Link>
        </p>
      }
    >
      <SignupForm />
    </AuthLayout>
  )
}

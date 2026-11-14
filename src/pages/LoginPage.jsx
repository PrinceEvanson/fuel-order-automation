import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to send or review purchase orders."
      footer={
        <p className="mt-6 text-center text-sm text-slate-500">
          New here? <Link to="/signup" className="font-medium text-emerald-700 hover:underline">Create an account</Link>
        </p>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}

import LoginForm from '../components/auth/LoginForm.jsx'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-xl font-semibold">Fuel Order Desk</h1>
                <p className="mb-6 mt-1 text-sm text-slate-500">Sign in to send or review purchase orders.</p>
                <LoginForm />
            </div>
        </div>
    )
}
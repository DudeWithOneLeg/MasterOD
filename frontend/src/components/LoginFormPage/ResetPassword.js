import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as sessionActions from '../../store/session'

export default function ResetPassword() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [isValidToken, setIsValidToken] = useState(false)
    const [success, setSuccess] = useState(false)
    const {token} = useParams()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        sessionActions.resetPassword({username, email, password})
        .then(async data => {
            if (data?.success) {
                setSuccess(true)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        sessionActions.verifyResetToken(token)
        .then(async data => {
            if (data?.success) {
                setIsValidToken(true)
                const {email, username} = data.user
                setEmail(email)
                setUsername(username)
            }
        })
        .catch(err => {
            console.log(err)
        })
    },[])

    useEffect(() => {
        if (password.length && password.length < 6) {
            setErrors({
                ...errors,
                password: "Password must be 6 characters or more",
            });
        } else if (password.length && password.length >= 6 && errors.password) {
            const newErrors = { ...errors };
            delete newErrors.password;
            setErrors(newErrors);
        }
    }, [password]);

    useEffect(() => {
        if (password !== confirmPassword) {
            setErrors({ ...errors, confirmPassword: "Must match password" });
        } else if (password === confirmPassword && errors.confirmPassword) {
            const newErrors = { ...errors };
            delete newErrors.confirmPassword;
            setErrors(newErrors);
        }
    }, [confirmPassword]);

    const isValidForm = () => !Object.values(errors).length && password.length && confirmPassword.length


    if (!token) navigate('/login')

    return (
        <div className={`h-full w-full flex items-center justify-center bg-zinc-900 text-white`}>
            {isValidToken ? (success ? <p>Password Reset</p> : <div className={`w-full max-w-md p-8 space-y-8 bg-zinc-800 rounded-lg shadow-lg`}>
                <h2 className="text-3xl text-center text-white">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className="mt-1 block w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm Password"
                            className="mt-1 block w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-zinc-500 ${isValidForm() ? 'bg-blue-500 hover:bg-blue-400' : 'bg-zinc-600'}`}
                            disabled={!isValidForm()}
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>) : <p>Loading</p>}
        </div>
    )
}

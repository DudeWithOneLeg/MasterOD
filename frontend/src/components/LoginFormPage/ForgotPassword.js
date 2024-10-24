import { useState } from "react"
import * as sessionActions from '../../store/session'

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email) return
        sessionActions.forgotPassword(email)
        setEmailSent(true)
    }

    return (
        <div className="w-full h-full flex items-center justify-center text-white">
            <div className={`w-full sm:w-2/3 md:w-1/2 lg:w-1/3 max-w-md p-8 space-y-8 bg-zinc-800 rounded-lg shadow-lg`}>

                {!emailSent ?
                    <div
                        className={`w-full h-fit flex flex-col items-center justify-content-center text-white`}>
                        <div className="flex items-start justify-center flex-col w-full h-full p-2">

                            <h1 className="text-2xl w-fit text-blue-500">Forgot Password</h1>
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 justify-around p-4 w-full h-full">
                                <div>
                                    <p>Email</p>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                                        className={`my-1 p-1 rounded text-black w-full border-4 focus:outline-none`} />
                                </div>
                                <button
                                    type='submit'
                                    className={`w-full py-2 px-4 ${email.length ? 'bg-blue-500 hover:bg-blue-400 focus:ring focus:ring-zinc-500' : 'bg-zinc-600 cursor-default'}  text-white font-semibold rounded-md focus:outline-none`}

                                >
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div> :
                    <div className="text-2xl text-blue-500">
                        Email will be sent if the user exists
                    </div>}
            </div>
        </div>
    )
}

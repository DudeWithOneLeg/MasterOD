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
            {!emailSent ?
                <div
                className={`w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-fit flex flex-col items-center justify-content-center text-white`}>
                    <div className="flex items-start justify-center flex-col w-1/2 h-1/2 p-2">

                        <h1 className="text-2xl w-fit text-blue-500">Forgot Password</h1>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 justify-around p-4 w-full h-full">
                            <div>
                                <p>Email</p>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                                className={`my-1 p-1 rounded text-black w-full border-4 focus:outline-none`}/>
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
    )
}

{/* <div className="w-full h-full flex items-center justify-center">
            <div
                className={`w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-fit flex flex-col items-center justify-content-center text-white`}
            >
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="w-full sm:w-2/3 md:w-1/2 p-4"
                >
                    <div className="flex flex-col items-center w-full h-fit">
                        <div className="py-2 flex flex-col items-center w-full h-fit">
                            <h1 className="align-self-start">Username *</h1>
                            <input
                                required
                                value={username}
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                                className={`my-1 p-1 rounded text-black w-full border-4 ${errors.username ? "border-red-200 bg-red-100" : "border-gray-300"} focus:outline-none`}
                            />
                            {errors.username ? (
                                <p className="text-red-300 h-fit w-full text-center">
                                    {errors.username}
                                </p>
                            ) : (
                                <p className="h-6"></p>
                            )}
                            <span className="h-10" />
                            <button
                                type="submit"
                                className={`my-1 rounded ${username.length >= 6 ? 'bg-blue-500' : 'bg-zinc-600'} p-1 px-2 w-full hover:bg-slate-700 text-xl`}
                            >
                                Finish Signup
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div> */}

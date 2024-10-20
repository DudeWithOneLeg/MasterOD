import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import * as sessionActions from "../../store/session";

export default function FinishSignup() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        if (username.length && username.length < 6) {
            setErrors({
                ...errors,
                username: "Username must be 6 characters or more",
            });
        }
        if (
            !username.length ||
            (username.length &&
                (username.length > 6 || username.length === 6) &&
                errors.username)
        ) {
            const newErrors = { ...errors };
            delete newErrors.username;
            setErrors(newErrors);
        }
    }, [username]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('sending request')
        if (!username) {
            return
        }

        dispatch(sessionActions.signup({ username, finishSignup: true }))
        .then(async (data) => {
            console.log('.then hit')
            if (data && data.user) {
                console.log('data received')
                navigate("/search");
            }
        })
    };
    if (!user?.tempUser) navigate('/search')

    return (
        <div className="w-full h-full flex items-center justify-center">
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
        </div>
    );
}

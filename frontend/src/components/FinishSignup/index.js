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
    const sessionUser = useSelector((state) => state.session.user);

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

    useEffect(() => {
        if (!sessionUser || !sessionUser.tempUser) {
            navigate("/signup");

            console.log(sessionUser)
        } else {
        }
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username) return;

        dispatch(sessionActions.signup({ username, finishSignup: true })).catch(async (res) => {
            const data = await res.json();
            if (data && data.user) {
                navigate("/search");
            }
        })
    };

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className={`w-${
                isMobile ? "2/3" : "1/3"
            } h-full flex flex-col items-center justify-content-center text-white`}
        >
            <div
                className={`flex flex-col items-center w-${
                    isMobile ? "full" : "1/2"
                }`}
            >
                <div className="py-2 flex flex-col items-center w-full">
                    <h1 className="align-self-start">Username *</h1>
                    <input
                        required
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        className={`my-1 p-1 rounded text-black w-full border-4 border-${
                            errors.username ? "red-200 bg-red-100" : ""
                        } focus:outline-none`}
                    />
                    {errors.username ? (
                        <p className="text-red-300 text-wrap h-6">
                            {errors.username}
                        </p>
                    ) : (
                        <p className="h-6"></p>
                    )}
                    <span className="h-10" />
                    <button
                        type="submit"
                        className="my-1 rounded-full border p-1 px-2 w-1/2 hover:bg-slate-700"
                    >
                        Finish Signup
                    </button>
                </div>
            </div>
        </form>
    );
}

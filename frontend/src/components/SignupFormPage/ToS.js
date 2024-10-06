import OpenModalButton from "../OpenModalButton";
import TermsOfServicePage from "../TermsOfServicePage";
export default function ToS({acceptedTOS, setAcceptedTOS}) {
    return (
        <div className="w-full flex items-center justify-center text-white">
            <div className="flex flex-row items-center justify-center">
                <input type="checkbox" checked={acceptedTOS} onChange={() => setAcceptedTOS(!acceptedTOS)}/>
                <span className="w-4"/>
                <label className="w-full m-0">I agree to the <OpenModalButton buttonText="Terms of Service" modalComponent={<TermsOfServicePage />} /></label>
            </div>
        </div>
    )
}

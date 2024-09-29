import { useNavigate } from "react-router-dom";
import sideBySide from '../../assets/images/side-by-side.png';
import operators from '../../assets/images/operators.png';
import multiEngines from '../../assets/images/multiple-engines.png';
import privacy from '../../assets/images/privacy.png';
import { isMobile } from "react-device-detect";
import Footer from "./Footer";

export default function WelcomePage() {
    return (
        <div className="bg-zinc-900 text-white h-full w-full overflow-x-hidden">
            <HeroSection />
            <FeaturesSection />
            <UserBenefits />
            <LiveDemo />
            <Footer />
        </div>
    );
}

// Hero Section Component
const HeroSection = () => {
    const navigate = useNavigate();
    const navToSignup = (e) => {
        e.preventDefault();
        navigate("/signup");
    }
    return (
        <section className="flex flex-col md:flex-row items-center justify-center p-8 w-full max-w-full">
            <div className="text-left md:text-left md:w-3/5">
                <p className="text-xl text-slate-400 poppins-regular">Discover and manage top-quality results from various search engines while ensuring your searches remain private.</p>
                <h1 className="text-4xl font-bold mb-4 poppins-bold">Research Efficiently</h1>
                <button className="mt-6 bg-indigo-700 py-3 px-6 rounded hover:bg-indigo-600" onClick={navToSignup}>Get Started</button>
            </div>
        </section>
    );
};

// Features Section Component
const FeaturesSection = () => {
    const features = [
        {
            icon: <img src={multiEngines} alt="Multi-Engine Search" className="w-full h-full" />,
            title: 'Multi-Engine Search',
            description: 'Search across multiple search engines effortlessly.',
        },
        {
            icon: <img src={operators} alt="Enhanced Search" className="w-full h-full" />,
            title: 'Enhanced Search',
            description: 'Utilize powerful search operators to refine your queries and get more relevant results.',
        },
        {
            icon: <img src={sideBySide} alt="Side-by-Side Viewing" className="w-full h-full" />,
            title: 'Side-by-Side Viewing',
            description: 'View search results and their web pages side by side to keep everything organized and in view.',
        },
        {
            icon: <img src={privacy} alt="Privacy First" className="w-full h-full" />,
            title: 'Privacy First',
            description: 'Your searches are secure, with no shared data.',
        },
    ];

    return (
        <section className="p-8 bg-zinc-900 w-full">
            <div className="flex justify-center">
                <div className="w-full md:w-full flex justify-center items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex justify-center items-center w-3/5">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-zinc-800 p-6 rounded-lg shadow-xl flex flex-col w-full h-full">
                                <div className="mb-4 flex justify-center md:justify-center w-full">{feature.icon}</div>
                                <h3 className="text-xl font-semibold poppins-semibold text-white w-full">{feature.title}</h3>
                                <p className="text-slate-400 poppins-regular text-sm mt-2 w-full">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const UserBenefits = () => {
    const benefits = [
        {
            title: 'Save Time',
            description: 'Quickly browse search results and web pages side by side, reducing the hassle of switching tabs.',
        },
        {
            title: 'Stay Organized',
            description: 'Easily categorize and save your searches for future reference, keeping your research streamlined.',
        },
        {
            title: 'Uncover Insights',
            description: 'Access historical snapshots to compare past and present versions of web pages and track changes over time.',
        },
        {
            title: 'Enhanced Privacy',
            description: 'Rest assured knowing that your search queries remain private and secure.',
        },
    ];

    return (
        <section className="p-8 w-full max-w-full">
            <h2 className="text-3xl font-bold text-center mb-8 poppins-bold">Why Search Deck?</h2>
            <div className="flex flex-col md:flex-row justify-around">
                {benefits.map((benefit, index) => (
                    <div key={index} className={`text-center mb-8 md:mb-0 bg-zinc-800 p-6 rounded-lg shadow-lg ${isMobile ? "w-full" : "w-1/5"}`}>
                        <h3 className="text-xl font-semibold poppins-semibold text-white">{benefit.title}</h3>
                        <p className="text-slate-400 poppins-regular">{benefit.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Live Demo CTA Section
const LiveDemo = () => {
    const navigate = useNavigate();
    const navToSignup = (e) => {
        e.preventDefault();
        navigate("/signup");
    }
    return (
        <section className="p-8 bg-slate-700 text-center w-full max-w-full">
            <h2 className="text-3xl font-bold mb-4 poppins-bold">Try Search Deck Now!</h2>
            <button className="bg-indigo-600 py-3 px-8 rounded hover:bg-indigo-500" onClick={navToSignup}>Start Searching</button>
        </section>
    );
};

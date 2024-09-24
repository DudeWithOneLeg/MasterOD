import { isMobile } from "react-device-detect";
import Footer from "./Footer";

export default function WelcomePage() {
    return (
        <div className="bg-zinc-900 text-white h-full w-full overflow-x-hidden">
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <LiveDemo />
            <Footer />
        </div>
    );
}

// Hero Section Component
const HeroSection = () => {
    return (
        <section className="flex flex-col md:flex-row items-center justify-center p-8 w-full max-w-full">
            <div className="text-center md:text-left md:w-1/2">
                <h1 className="text-4xl font-bold mb-4">Re-Imagining Research</h1>
                <p className="text-xl text-slate-400">Search across multiple engines, access snapshots, and keep your searches private.</p>
                <button className="mt-6 bg-indigo-700 py-3 px-6 rounded hover:bg-slate-600">Get Started</button>
            </div>
        </section>
    );
};

// Features Section Component
const FeaturesSection = () => {
    const features = [
        {
          // icon: <FaSearch size={32} />,
          title: 'Multi-Engine Search',
          description: 'Search across multiple search engines effortlessly.',
        },
        {
          // icon: <FaGlobe size={32} />,
          title: 'Snapshot Viewing',
          description: 'Access snapshots from the Wayback Machine directly.',
        },
        {
          // icon: <FaColumns size={32} />, // You could replace with an appropriate icon
          title: 'Side-by-Side Viewing',
          description: 'View live search results and snapshots side by side for better comparison.',
        },
        {
          // icon: <FaLock size={32} />,
          title: 'Privacy First',
          description: 'Your searches are secure, with no shared data.',
        },
      ];

    return (
        <section className="p-8 bg-zinc-800 w-full max-w-full">
            <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
            <div className="flex flex-col md:flex-row justify-around">
                {features.map((feature, index) => (
                    <div key={index} className="text-center mb-8 md:mb-0">
                        <div className="mb-4"></div>
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="text-slate-400">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

// How It Works Section
const HowItWorks = () => {
    const steps = [
        'Enter search terms with built-in operator interface',
        'Review live search results and archived snapshots',
        'Save and categorize searches for future reference',
    ];

    return (
        <section className="p-8 w-full max-w-full">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="flex flex-col items-center space-y-6">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <span className="text-slate-400 font-semibold text-xl">{index + 1}</span>
                        <p className="text-slate-300">{step}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Live Demo CTA Section
const LiveDemo = () => {
    return (
        <section className="p-8 bg-slate-700 text-center w-full max-w-full">
            <h2 className="text-3xl font-bold mb-4">Try Search Deck Now!</h2>
            <button className="bg-indigo-600 py-3 px-8 rounded hover:bg-slate-500">Start Searching</button>
        </section>
    );
};

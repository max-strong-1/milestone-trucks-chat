import RetellWidget from '@/components/RetellWidget';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://staging12.milestonetrucks.com/wp-content/uploads/2024/05/dump-truck-service-bg.jpg"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Milestone Trucks
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                        Reliable delivery of Gravel, Topsoil, Mulch, and Sand. Expert Dump Truck Services for Homeowners and Contractors.
                    </p>
                    <div className="mt-10 flex gap-4">
                        <a href="#" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-8 rounded-md transition-colors">
                            Order Now
                        </a>
                        <a href="#" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-md backdrop-blur-sm transition-colors">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Gravel & Stone', desc: 'High-quality gravel and decorative stone for your landscaping needs.' },
                        { title: 'Topsoil & Mulch', desc: 'Premium topsoil and mulch to keep your garden thriving.' },
                        { title: 'Dump Truck Services', desc: 'Professional hauling and delivery services for any project size.' },
                    ].map((service, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Retell Widget */}
            <RetellWidget />
        </main>
    );
}

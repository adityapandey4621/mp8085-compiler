import SimulatorNav from "@/components/simulator-nav"

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">
            <SimulatorNav />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">8085 Documentation</h1>
                <div className="prose prose-invert max-w-none">
                    <p>Welcome to the MP8085 Simulator documentation.</p>
                    {/* Content will be added here */}
                </div>
            </main>
        </div>
    )
}

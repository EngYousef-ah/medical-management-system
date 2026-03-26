export default function StatsHome() {
    const stats = [
        { title: "1200+", desc: "Active Patients" },
        { title: "98%", desc: "System Reliability" },
        { title: "24/7", desc: "Support" },
    ];
    return (
        <section className="py-20 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-center">

                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl smooth">
                        <h3 className="text-4xl font-bold text-[#23a997]">{s.title}</h3>
                        <p className="text-gray-500 mt-2">{s.desc}</p>
                    </div>
                ))}

            </div>
        </section>
    );
}
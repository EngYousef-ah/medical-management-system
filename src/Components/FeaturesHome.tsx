import image2 from '../assets/imgs/img2.jpg';
import image3 from '../assets/imgs/img3.jpg';
import image4 from '../assets/imgs/img4.jpg';
export default function FeaturesHome() {
    const features = [
        {
            title: "Patient Records",
            desc: "Secure digital storage of medical history and data.",
            img: {image2}
        },
        {
            title: "Smart Scheduling",
            desc: "Automated appointment management system.",
            img: {image3}
        },
        {
            title: "Analytics Dashboard",
            desc: "Real-time insights and medical statistics.",
            img:{image4}
        }
    ];
    return (
        <section className="py-24 px-6 lg:px-20 bg-gray-100">

            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#104c44]">Our Features</h2>
                <p className="text-gray-500 mt-3">
                    Everything you need to manage your medical practice.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">

                {features.map((f, i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 smooth">
                        <img src={f.img} className="rounded-2xl mb-6 h-48 w-full object-cover" />

                        <h3 className="text-xl font-bold text-[#104c44] mb-3">
                            {f.title}
                        </h3>

                        <p className="text-gray-500">{f.desc}</p>
                    </div>
                ))}

            </div>
        </section>
    );
}
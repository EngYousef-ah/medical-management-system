export default function Heading({ title = "" }) {
    return (
        <h1 className="bg-linear-to-r from-[#23a997]  to-[#104c44] text-transparent bg-clip-text  text-2xl font-bold mb-2 sm:text-4xl">
            {title}
        </h1>
    );
}
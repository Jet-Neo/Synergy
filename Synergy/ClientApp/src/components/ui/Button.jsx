export function Button({ children, className = "", ...props }) {
    return (
        <button
            className={`px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
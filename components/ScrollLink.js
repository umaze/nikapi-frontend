import Link from "next/link";

export default function({children, ...props}) {
    const handleScroll = e => {
        // Prevent default behavior
        e.preventDefault();
        // Get href and remove everything before the hash
        const href = e.currentTarget.href;
        const targetId = href.replace(/.*\#/, "");
        // Get the element by id and use scrollIntoView
        const elem = document.getElementById(targetId);
        window.scrollTo({
            top: elem?.getBoundingClientRect().top,
            behavior: "smooth"
        });
    };

    return (
        <Link {...props} onClick={handleScroll}>
            {children}
        </Link>
    );
}

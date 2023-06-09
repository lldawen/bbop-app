import Link from "next/link";

const CustomLink = ({ href, text }) =>
    <Link 
        style={{ color: '#942230', textDecoration: 'underlined', fontWeight: 'bold' }} 
        href={href}>
            {text}
    </Link>;

export default CustomLink;
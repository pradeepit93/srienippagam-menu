import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export const SEO = ({
    title = "Sri Enippagam - Authentic Indian Sweets Since 1985",
    description = "Discover authentic Indian sweets at Sri Enippagam. Browse our menu of traditional mithai including Gulab Jamun, Jalebi, Kaju Katli, Barfi, and more. Order online today!",
    image = "/og-image.png",
    url = "https://srienippagam.com",
}: SEOProps) => {
    const siteTitle = title;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Sri Enippagam",
        "image": [image],
        "priceRange": "₹₹",
        "servesCuisine": "Indian Sweets",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "New Scheme Rd",
            "addressLocality": "Pollachi",
            "addressRegion": "Tamil Nadu",
            "postalCode": "642001",
            "addressCountry": "IN"
        },
        "telephone": "+918870144490",
        "url": url
    };

    return (
        <Helmet>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

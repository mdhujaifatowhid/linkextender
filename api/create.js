import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

function generateSlug(length = 8) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let slug = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(
            Math.random() * characters.length
        );

        slug += characters[randomIndex];
    }

    return slug;
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const { originalUrl, customValue } = req.body || {};

    if (!originalUrl) {
        return res.status(400).json({
            error: "URL is required"
        });
    }

    let slug = customValue?.trim();

    if (!slug) {
        slug = generateSlug();
    }

    slug = slug
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (!slug) {
        slug = generateSlug();
    }

    const { data: existingLink } = await supabase
        .from("links")
        .select("slug")
        .eq("slug", slug)
        .maybeSingle();

    if (existingLink) {
        return res.status(409).json({
            error: "This custom link already exists"
        });
    }

    const { error } = await supabase
        .from("links")
        .insert({
            slug,
            original_url: originalUrl
        });

    if (error) {
        console.error(error);

        return res.status(500).json({
            error: "Could not save the link"
        });
    }

    const baseUrl =
        `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;

    const extendedUrl =
        `${baseUrl}/go/${slug}-this-link-is-now-much-longer`;

    return res.status(200).json({
        url: extendedUrl
    });
}

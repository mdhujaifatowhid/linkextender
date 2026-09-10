import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).send("Invalid link");
    }

    const actualSlug = slug.replace(
        "-this-link-is-now-much-longer",
        ""
    );

    const { data, error } = await supabase
        .from("links")
        .select("original_url")
        .eq("slug", actualSlug)
        .single();

    if (error || !data) {
        return res.status(404).send("Link not found");
    }

    return res.redirect(302, data.original_url);
}

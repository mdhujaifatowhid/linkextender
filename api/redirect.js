import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

const EXTEND_SUFFIXES = [
    "this-link-is-now-much-longer-than-it-ever-used-to-be-and-keeps-getting-longer",
    "this-link-has-been-extended-and-is-now-significantly-longer-than-before-and-honestly-still-growing",
    "wow-this-link-got-so-much-bigger-than-it-used-to-be-and-somehow-it-just-keeps-expanding-forever",
    "congratulations-your-link-is-now-officially-longer-than-anyone-ever-expected-it-to-become",
    "this-used-to-be-a-tiny-link-but-not-anymore-because-now-it-is-basically-an-entire-sentence",
];

function stripSuffix(slug) {
    for (const suffix of EXTEND_SUFFIXES) {
        const tail = `-${suffix}`;

        if (slug.endsWith(tail)) {
            return slug.slice(0, -tail.length);
        }
    }

    return slug;
}

export default async function handler(req, res) {
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).send("Invalid link");
    }

    const actualSlug = stripSuffix(slug);

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

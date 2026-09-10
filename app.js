document.addEventListener("DOMContentLoaded", function () {
    const linkForm = document.getElementById("linkForm");
    const urlInput = document.getElementById("urlInput");
    const customInput = document.getElementById("customInput");
    const submitButton = document.getElementById("submitButton");

    const loading = document.getElementById("loading");
    const result = document.getElementById("result");
    const resultInput = document.getElementById("resultInput");
    const copyButton = document.getElementById("copyButton");
    const copyStatus = document.getElementById("copyStatus");

    const languageToggle = document.getElementById("languageToggle");

    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");
    const loadingText = document.getElementById("loadingText");
    const resultTitle = document.getElementById("resultTitle");
    const terms = document.getElementById("terms");

    let currentLanguage = "bn";

    if (linkForm) {
        linkForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let originalUrl = urlInput.value.trim();
            const customValue = customInput.value.trim();

            if (!originalUrl) {
                return;
            }

            if (!/^https?:\/\//i.test(originalUrl)) {
                originalUrl = "https://" + originalUrl;
            }

            loading.style.display = "block";
            result.style.display = "none";
            copyStatus.textContent = "";
            submitButton.disabled = true;

            setTimeout(function () {
                const extendedLink = createExtendedLink(
                    originalUrl,
                    customValue
                );

                resultInput.value = extendedLink;

                loading.style.display = "none";
                result.style.display = "block";
                submitButton.disabled = false;
            }, 1500);
        });
    }

    function createExtendedLink(originalUrl, customValue) {
        const baseUrl = "https://linkextender.vercel.app/go/";

        let slug = customValue;

        if (!slug) {
            try {
                const url = new URL(originalUrl);

                slug = url.hostname
                    .replace(/\./g, "-")
                    .replace(/[^a-zA-Z0-9-]/g, "");
            } catch {
                slug = "extended-link";
            }
        }

        const extraText =
            "-this-link-has-been-extended-successfully-and-is-now-much-longer";

        return baseUrl + slug + extraText;
    }

    if (copyButton) {
        copyButton.addEventListener("click", async function () {
            if (!resultInput.value) {
                return;
            }

            try {
                await navigator.clipboard.writeText(resultInput.value);

                copyStatus.textContent =
                    currentLanguage === "bn"
                        ? "লিংক কপি হয়েছে!"
                        : "Link copied!";
            } catch {
                resultInput.select();
                document.execCommand("copy");

                copyStatus.textContent =
                    currentLanguage === "bn"
                        ? "লিংক কপি হয়েছে!"
                        : "Link copied!";
            }

            setTimeout(function () {
                copyStatus.textContent = "";
            }, 2000);
        });
    }

    if (languageToggle) {
        languageToggle.addEventListener("change", function () {
            currentLanguage = languageToggle.checked ? "en" : "bn";

            updateLanguage();
        });
    }

    function updateLanguage() {
        if (currentLanguage === "en") {
            if (title) title.textContent = "Extend Your Link";
            if (subtitle) subtitle.textContent = "Make any short link longer instantly!";

            if (urlInput) urlInput.placeholder = "Paste your short link here";
            if (customInput) customInput.placeholder = "Custom link";

            if (submitButton) submitButton.textContent = "Create Link";
            if (loadingText) loadingText.textContent = "Please wait...";
            if (resultTitle) resultTitle.textContent = "Your extended link is ready!";

            if (terms) {
                terms.innerHTML =
                    'By clicking Create Link, You agree with our <a href="#" id="termsLink">Terms of Service</a>.';
            }
        } else {
            if (title) title.textContent = "ছোট লিংক বড় করুন";
            if (subtitle) subtitle.textContent = "যে কোন ছোট লিংক অতি দ্রুত বড় করুন!";

            if (urlInput) urlInput.placeholder = "ছোট লিংকটি এখানে পেস্ট করুন";
            if (customInput) customInput.placeholder = "কাস্টম লিংক";

            if (submitButton) submitButton.textContent = "লিংক তৈরি করুন";
            if (loadingText) loadingText.textContent = "অপেক্ষা করুন...";
            if (resultTitle) resultTitle.textContent = "আপনার বড় লিংক প্রস্তুত!";

            if (terms) {
                terms.innerHTML =
                    'By clicking Extend Link, You agree with our <a href="#" id="termsLink">Terms of Service</a>.';
            }
        }
    }
});

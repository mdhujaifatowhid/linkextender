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
const banglaText = document.getElementById("banglaText");
const englishText = document.getElementById("englishText");
const urlPlaceholder = document.getElementById("urlInput");
const customPlaceholder = document.getElementById("customInput");
const loadingText = document.getElementById("loadingText");
const resultTitle = document.getElementById("resultTitle");
const terms = document.getElementById("terms");
const termsLink = document.getElementById("termsLink");

let currentLanguage = "bn";

linkForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const originalUrl = urlInput.value.trim();
    const customValue = customInput.value.trim();

    if (!originalUrl) {
        return;
    }

    loading.style.display = "block";
    result.style.display = "none";
    submitButton.disabled = true;

    setTimeout(() => {
        const extendedLink = createExtendedLink(originalUrl, customValue);

        resultInput.value = extendedLink;

        loading.style.display = "none";
        result.style.display = "block";
        submitButton.disabled = false;
    }, 1500);
});

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

    setTimeout(() => {
        copyStatus.textContent = "";
    }, 2000);
});

languageToggle.addEventListener("change", function () {
    currentLanguage = languageToggle.checked ? "en" : "bn";

    updateLanguage();
});

function updateLanguage() {
    if (currentLanguage === "en") {
        title.textContent = "Extend Your Link";
        subtitle.textContent = "Make any short link longer instantly!";
        urlPlaceholder.placeholder = "Paste your link here";
        customPlaceholder.placeholder = "Custom link";
        submitButton.textContent = "Create Link";
        loadingText.textContent = "Please wait...";
        resultTitle.textContent = "Your extended link is ready!";
        copyButton.textContent = "Copy";
        terms.innerHTML =
            'By clicking Create Link, You agree with our <a href="#" id="termsLink">Terms of Service</a>.';
    } else {
        title.textContent = "ছোট লিংক বড় করুন";
        subtitle.textContent = "যে কোন ছোট লিংক অতি দ্রুত বড় করুন!";
        urlPlaceholder.placeholder = "ছোট লিংকটি এখানে পেস্ট করুন";
        customPlaceholder.placeholder = "কাস্টম লিংক";
        submitButton.textContent = "লিংক তৈরি করুন";
        loadingText.textContent = "অপেক্ষা করুন...";
        resultTitle.textContent = "আপনার বড় লিংক প্রস্তুত!";
        copyButton.textContent = "Copy";
        terms.innerHTML =
            'By clicking Shorten Link, You agree with our <a href="#" id="termsLink">Terms of Service</a>.';
    }
}
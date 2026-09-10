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

linkForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const originalUrl = urlInput.value.trim();
    const customValue = customInput.value.trim();

    if (!originalUrl) {
        return;
    }

    if (!/^https?:\/\//i.test(originalUrl)) {
                originalUrl = "https://" + originalUrl;
            }

        return;
    }

    loading.style.display = "block";
    result.style.display = "none";
    copyStatus.textContent = "";
    submitButton.disabled = true;

    try {
        const response = await fetch("/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                originalUrl,
                customValue
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        resultInput.value = data.url;

        loading.style.display = "none";
        result.style.display = "block";
    } catch (error) {
        loading.style.display = "none";

        alert(
            currentLanguage === "bn"
                ? "লিংক তৈরি করা যায়নি। আবার চেষ্টা করুন।"
                : "Could not create the link. Please try again."
        );

        console.error(error);
    } finally {
        submitButton.disabled = false;
    }
});

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

languageToggle.addEventListener("change", function () {
    currentLanguage = languageToggle.checked ? "en" : "bn";

    updateLanguage();
});

function updateLanguage() {
    if (currentLanguage === "en") {
        title.textContent = "Extend Your Link";

        subtitle.textContent =
            "Make any short link longer instantly!";

        urlInput.placeholder =
            "Paste your short link here";

        customInput.placeholder =
            "Custom link";

        submitButton.textContent =
            "Create Link";

        loadingText.textContent =
            "Please wait...";

        resultTitle.textContent =
            "Your extended link is ready!";

        terms.innerHTML =
            'By clicking Create Link, You agree with our <a href="#">Terms of Service</a>.';
    } else {
        title.textContent =
            "ছোট লিংক বড় করুন";

        subtitle.textContent =
            "যে কোন ছোট লিংক অতি দ্রুত বড় করুন!";

        urlInput.placeholder =
            "ছোট লিংকটি এখানে পেস্ট করুন";

        customInput.placeholder =
            "কাস্টম লিংক";

        submitButton.textContent =
            "লিংক তৈরি করুন";

        loadingText.textContent =
            "অপেক্ষা করুন...";

        resultTitle.textContent =
            "আপনার বড় লিংক প্রস্তুত!";

        terms.innerHTML =
            'By clicking Create Link, You agree with our <a href="#">Terms of Service</a>.';
    }
}

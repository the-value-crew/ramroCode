import hljs from "highlight.js";

export const highlight = async (code, language) => {
    if (!code) return null;
    if (language) {
        let hlData = hljs.highlight(language, code);
        return { value: hlData.value, language: hlData.language };
    }
    let hlData = hljs.highlightAuto(code);
    return { value: hlData.value, language: hlData.language };
}
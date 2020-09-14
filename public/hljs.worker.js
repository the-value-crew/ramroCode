import hljs from "highlight.js";

onmessage = function (event) {
    let data = event.data;
    if (!data.code) postMessage(null);
    if (data.language) postMessage(hljs.highlight(data.language, data.code));
    postMessage(hljs.highlightAuto(data.code));
};
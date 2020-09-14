// import lzstring from "lz-string";

export const fluctuateRgb = (color, n) => {
    let rgb = color.match(/\d+/g).map(Number);
    rgb = rgb.map((d) => ((d += n) < 0 ? 0 : d > 255 ? 255 : d | 0));

    // if color is completely white make it darker
    if (rgb[0] > 200 && rgb[1] > 200 && rgb[2] > 200)
        rgb = rgb.map((d) => ((d -= n) < 0 ? 0 : d > 255 ? 255 : d | 0));

    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export const downloadImage = (dataUrl, extension) => {
    var link = document.createElement("a");
    link.download = "ramroCode." + extension;
    link.href = dataUrl;
    link.click();
}

export const copyBlobToClipboard = async (blob) => {
    try {
        const { state } = await navigator.permissions.query({ name: "clipboard-write" });
        if (state === "granted") {
            navigator.clipboard.write([new window.ClipboardItem({ [blob.type]: blob })]);
            alert("📋 Copied to clipboard");
        }
    } catch (error) {
        console.log(error);
        let msg = "Sorry you browser doesn't support this feature. Downlaod the image instead 🙂";
        alert(msg);
    }
};

export const copyConfigToClipboard = async (config) => {
    let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "#/";
    url += "?data=" + encodeURIComponent(config);

    console.log(url);

    try {
        const { state } = await navigator.permissions.query({ name: "clipboard-write" });
        if (state === "granted") {
            navigator.clipboard.writeText(url);
            alert("📋 Config URL copied to clipboard.");
        }
    } catch (error) {
        console.log(error);
        let msg = "Sorry you browser doesn't support this feature.";
        alert(msg);
    }
}
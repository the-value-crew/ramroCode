import domtoimage from "dom-to-image-more";

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
        const { state } = await navigator.permissions.query({
            name: "clipboard-write",
        });
        if (state === "granted") {
            navigator.clipboard.write([
                new window.ClipboardItem({ [blob.type]: blob }),
            ]);
            alert("📋 Copied to clipboard");
        }
    } catch (error) {
        console.log(error);
        alert(
            "Sorry you browser doesn't support this feature. Downlaod the image instead 🙂"
        );
    }
}

export const domToImage = async (type, node) => {
    if (type == "Copy") {
        domtoimage
            .toBlob(node)
            .then((blob) => {
                copyBlobToClipboard(blob);
            })
            .catch((err) => {
                console.log(err);
                throw "Oops, something went wrong!";
            });
        return;
    }

    let option =
        type === "Jpeg" ? { quality: this.downloadImageQuality } : null;
    domtoimage["to" + type](node, option)
        .then((dataUrl) => {
            downloadImage(dataUrl, type.toLowerCase());
        })
        .catch((err) => {
            console.log(err);
            throw "Oops, something went wrong!";
        });
}
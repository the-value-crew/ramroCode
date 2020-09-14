import domtoimage from "dom-to-image-more";
import { downloadImage, copyBlobToClipboard } from "@/helpers/core";

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
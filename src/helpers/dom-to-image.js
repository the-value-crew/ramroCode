import domtoimage from "dom-to-image-more";
import { downloadImage, copyBlobToClipboard } from "@/helpers/core";

export const domToImage = async (
  type,
  domNode,
  imageQuality = 1,
  scale,
  download = true,
  callback
) => {
  // clone node
  // domNode = domNode.cloneNode(true);

  const option = {
    width: domNode.clientWidth * scale,
    height: domNode.clientHeight * scale,
    style: {
      transform: "scale(" + scale + ")",
      transformOrigin: "top left",
    },
  };

  if (type == "Copy") {
    domtoimage
      .toBlob(domNode, option)
      .then((blob) => {
        copyBlobToClipboard(blob);
      })
      .catch((err) => {
        console.log(err);
        throw "Oops, something went wrong!";
      });
    return;
  }

  if (type === "Jpeg") option.quality = imageQuality;
  domtoimage["to" + type](domNode, option)
    .then((dataUrl) => {
      if (download) downloadImage(dataUrl, type.toLowerCase());
      else callback(`<img src="${dataUrl}">`);
    })
    .catch((err) => {
      console.log(err);
      throw "Oops, something went wrong!";
    });
};

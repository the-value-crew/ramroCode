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
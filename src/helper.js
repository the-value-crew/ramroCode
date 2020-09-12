export const fluctuateRgb = (color, n) => {
    let rgb = color.match(/\d+/g).map(Number);
    rgb = rgb.map((d) => ((d += n) < 0 ? 0 : d > 255 ? 255 : d | 0));
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
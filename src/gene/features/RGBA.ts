export class RGBA {
    static color(r: number, g: number, b: number, a: number = 255) {
        const alpha = Math.round(a) << 24;
        const red = r << 16;
        const green = g << 8;
        const blue = b;

        const hexNumber = alpha | red | green | blue;

        return hexNumber >>> 0;
    }

    static red = RGBA.color(255, 0, 0);
    static green = RGBA.color(0, 255, 0);
    static blue = RGBA.color(0, 0, 255);
    static yellow = RGBA.color(255, 255, 0);
    static purple = RGBA.color(255, 0, 255);
    static cyan = RGBA.color(0, 255, 255);
    static black = RGBA.color(0, 0, 0);
    static white = RGBA.color(255, 255, 255);
}

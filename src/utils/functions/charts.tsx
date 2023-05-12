export const translateStateLgaToLga = (key: string) => {
    const lga_code = JSON.parse(key.replace(/'/g, '"'))[1];
    return Number(lga_code);
}

function generateColorCode(): string {
    const colorCode = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return colorCode;
}

export function generateColorCodesArray(count: number): string[] {
    const colorCodes: string[] = [];
    for (let i = 0; i < count; i++) {
        const colorCode = generateColorCode();
        colorCodes.push(colorCode);
    }
    return colorCodes;
}

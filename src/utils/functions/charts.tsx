export const translateStateLgaToLga = (key: string) => {
    const lga_code = JSON.parse(key.replace(/'/g, '"'))[1];
    return Number(lga_code);
}
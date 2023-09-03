export function getPriceAsNumber(inputPrice: string): number {
    return parseFloat(inputPrice?.replace(",", ".").replace("€", "") as string);
}
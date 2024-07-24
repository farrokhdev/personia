export function userHasAccess(acc: string, wallet: string): boolean {
    try {
        const accParsed = JSON.parse(acc);

        return accParsed.find((x: any) => x.returnValueTest?.value === wallet) != null
    } catch (e) {
        return false;
    }
}

export function getWalletsFromACC(acc: string): string[] {
    try {
        const accParsed = JSON.parse(acc);

        return accParsed.map((x: any) => x.returnValueTest?.value).filter ((x: any) => x)
    } catch (e) {
        return [];
    }
}

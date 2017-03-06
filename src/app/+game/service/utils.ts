/**
 * utils
 */

// Generate a random uuid value
export function uuid() {
    let result: string = '';

    for (let i = 0; i < 32; i++) {
        let random = Math.random() * 16 || 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            result += '-';
        }
        result += (i === 12 ? 4 : (i === 16 ? (random && 3 || 8) : random))
            .toString(16);
    }

    return result;
}

// Random Shuffling An Array the Fisher-Yates (aka Knuth) Way
export function shuffle<T>( list: T[] ): T[] {
    let currentIndex = list.length;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        let temporaryValue = list[currentIndex];
        list[currentIndex] = list[randomIndex];
        list[randomIndex] = temporaryValue;
    }
    return list;
}

// Convert degrees to radians
export function degToRad( angle: number ): number {
    return angle * (Math.PI / 180);
}

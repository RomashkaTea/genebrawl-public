export class NCoder {
    static s2n(str: string): { pesok: string; checksum: number; isSniffDetected: boolean; warn: string; meow: number; } {
        // we've decided to keep our "encryption" (if we can call it like that) private :)
        // not sure if it works after these changes but eh

        return {
            pesok: str,
            checksum: -1,
            isSniffDetected: false,
            warn: "",
            meow: 6967
        };
    }

    static n2s(str: string): string {
        // we've decided to keep our "encryption" (if we can call it like that) private :)
        return str;
    }

    static stringToBytes(str: string): Uint8Array {
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes;
    }

    static arrayBufferToString(buffer: ArrayBuffer): string {
        const uint8Array = new Uint8Array(buffer);
        let str = "";
        for (let i = 0; i < uint8Array.length; i++) {
            str += String.fromCharCode(uint8Array[i]);
        }
        return str;
    }
}

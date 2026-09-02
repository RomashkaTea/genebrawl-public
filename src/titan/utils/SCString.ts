import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";
import {Buffer} from 'buffer';

const String_ctor = new NativeFunction( // "CancelledIAPs"
    Libg.offset(0xBF8148, 0xB922CC), 'void', ['pointer', 'pointer']
);

export class SCString {
    static ctor(ptr: NativePointer, string: NativePointer) {
        String_ctor(ptr, string);
    }

    static setContent(ptr: NativePointer, content: string) {
        const charLen = content.length;
        const byteLen = Buffer.from(content).length;

        ptr.writeU32(charLen);
        ptr.add(4).writeU32(byteLen);

        if (byteLen > 7) {
            const longStringAllocPtr = Libc.malloc(byteLen + 1);
            longStringAllocPtr.writeUtf8String(content);
            ptr.add(8).writePointer(longStringAllocPtr);
        } else {
            ptr.add(8).writeUtf8String(content);
        }
    }
}

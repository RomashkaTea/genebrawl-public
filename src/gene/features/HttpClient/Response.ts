export class Response {
    private readonly statusCode: string;
    private readonly headers: Record<string, string>;
    private readonly body: Uint8Array;

    constructor(statusCode: string, headers: Record<string, string>, body: Uint8Array) {
        this.statusCode = statusCode;
        this.headers = headers;
        this.body = body;
    }

    getStatusCode() {
        const parsedCode = this.statusCode.split(" ")[1];

        return Number(parsedCode);
    }

    getBody() {
        return this.body;
    }
}

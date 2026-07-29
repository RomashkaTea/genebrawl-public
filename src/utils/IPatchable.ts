export interface IPatchable {
    patch(): void;
    name?: string;
}

export class PatchManager {
    static patch(modules: IPatchable[]) {
        for (const module of modules) {
            try {
                module.patch();
            } catch (e: any) {
                const name = (module as any).name || "UnknownModule";
                console.error(`[PatchManager] Failed to apply patch for ${name}:`, e);
            }
        }
    }
}

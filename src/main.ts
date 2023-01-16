import { error } from "./feedback";
import { getCommand } from "./command";
import { defaultLogger } from "./default-logger";
import { workspaceDiscovery } from "./workspace-discovery";

async function main(): Promise<void> {
    const command = getCommand();
    const output = await workspaceDiscovery({ logger: defaultLogger })(command);
    process.stdout.write(JSON.stringify(output, null, "  "));
}

((): void => {
    try {
        main();
    } catch (e) {
        error("Something went wrong!");
        error(e);
        process.exit(1);
    }
})();

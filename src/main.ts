import { error } from "./feedback";
import { getCommand } from "./command";
import { discoverWorkspaces } from "./discover-workspaces";

async function main(): Promise<void> {
    const command = getCommand();
    const output = await discoverWorkspaces(command);
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

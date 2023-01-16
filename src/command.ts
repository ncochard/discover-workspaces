import { DiscoverWorkspacesInput } from "./types";
import { program } from "commander";
import { makeString } from "./utilities";
import { CWD } from "./constants";

export function getCommand(): DiscoverWorkspacesInput {
    program.option(`--${CWD} <${CWD}>`, "Root folder of the mono-repo", process.cwd());

    program.parse(process.argv);
    const options = program.opts();
    const cwd = makeString(options[CWD]);
    if (!cwd?.length) {
        throw new Error(`missing --${CWD} parameter`);
    }
    return { cwd };
}

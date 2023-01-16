import chalk from "chalk";
import { projectName } from "./constants";

const n = chalk.bold(`[${projectName}]`);
const f = chalk.dim(`(${process.cwd()})`);

export function debug(message: string): void {
    process.stdout.write(`${n} ${message} ${f}\n`);
}
export function error(message: unknown): void {
    if (typeof message === "string") {
        process.stdout.write(`${n} ${message} ${f}\n`);
    } else {
        console.error(message);
    }
}
export function info(message: string): void {
    process.stdout.write(`${n} ${message} ${f}\n`);
}
export function prefixed(prefix: string, message: string): void {
    const str = `${chalk.bold(`[${prefix}]`)} ${message}\n`;
    process.stdout.write(str);
}

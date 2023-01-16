import { error } from "./feedback";
import { Logger } from "./types";

export const defaultLogger: Logger = {
    error: error,
};

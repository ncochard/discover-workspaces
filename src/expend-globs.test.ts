import { join } from "path";
import { expendGlob, expendGlobs, mergeWorkspacePaths } from "./expend-globs";

describe("expendGlob", () => {
    it("works for sample mono-repo", async () => {
        const cwd = join(__dirname, "../test-projects/sample-mono-repo");
        const wildcard = "packages/*";
        const packages = await expendGlob(cwd, wildcard);
        expect(packages).toContain(join(cwd, "packages/libs"));
        expect(packages).toContain(join(cwd, "packages/package-1"));
        expect(packages).toContain(join(cwd, "packages/package-2"));
        expect(packages).toContain(join(cwd, "packages/package-leaf"));
        expect(packages).toContain(join(cwd, "packages/top-package"));
        expect(packages).toContain(join(cwd, "packages/utilities"));
    });
});

describe("expendGlobs", () => {
    it("works for sample mono-repo", async () => {
        const cwd = join(__dirname, "../test-projects/sample-mono-repo");
        const wildcards = ["packages/*", "packages/libs/*", "packages/utilities/utility"];
        const packages = await expendGlobs(cwd, wildcards);
        expect(packages).toContain(join(cwd, "packages/libs"));
        expect(packages).toContain(join(cwd, "packages/libs/lib1"));
        expect(packages).toContain(join(cwd, "packages/libs/lib2"));
        expect(packages).toContain(join(cwd, "packages/package-1"));
        expect(packages).toContain(join(cwd, "packages/package-2"));
        expect(packages).toContain(join(cwd, "packages/package-leaf"));
        expect(packages).toContain(join(cwd, "packages/top-package"));
        expect(packages).toContain(join(cwd, "packages/utilities"));
        expect(packages).toContain(join(cwd, "packages/utilities/utility"));
    });
});

describe("mergeWorkspacePaths", () => {
    it("works for sample mono-repo", async () => {
        const cwd = join(__dirname, "../test-projects/sample-mono-repo");
        const input = [
            "packages/libs",
            "packages/libs/lib1",
            "packages/libs/lib2",
            "packages/package-1",
            "packages/package-2",
            "packages/package-leaf",
            "packages/top-package",
            "packages/utilities",
            "packages/utilities/utility",
        ].map(p => join(cwd, p));
        const expected = [
            "packages/libs/lib1",
            "packages/libs/lib2",
            "packages/package-1",
            "packages/package-2",
            "packages/package-leaf",
            "packages/top-package",
            "packages/utilities/utility",
        ].map(p => join(cwd, p));
        expect(mergeWorkspacePaths(input)).toEqual(expected);
    });
});

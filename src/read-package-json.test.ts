import { readPackageJson, ReadPackageJsonDependencies } from "./read-package-json";
import { join } from "path";

const dependencies: ReadPackageJsonDependencies = {
    logger: console,
};

describe("readPackageJson", () => {
    it("works for our main package.json", async () => {
        const path = join(__dirname, "..");
        const pkg = await readPackageJson(dependencies)(path);
        expect(pkg).toBeDefined();
        if (!pkg) {
            throw new Error("Cannot be null");
        }
        expect(pkg.identifier.name).toBe("discover-workspaces");
        expect(pkg.dependencies.map(d => d.name)).toContain("commander");
        expect(pkg.devDependencies.map(d => d.name)).toContain("eslint");
        expect(pkg.scripts).toContain("build");
    });
    it("works for mono-repo test project", async () => {
        const path = join(__dirname, "../test-projects/no-mono-repo");
        const pkg = await readPackageJson(dependencies)(path);
        expect(pkg).toBeDefined();
        if (!pkg) {
            throw new Error("Cannot be null");
        }
        expect(pkg.identifier.name).toBe("no-mono-repo");
        expect(pkg.dependencies).toEqual([{ name: "lodash", version: "4.17.21" }]);
        expect(pkg.devDependencies).toEqual([{ name: "rimraf", version: "^3.0.2" }]);
        expect(pkg.peerDependencies).toEqual([{ name: "react", version: "14" }]);
        expect(pkg.scripts).toEqual([]);
    });
    it("works for sample-mono-repo test project", async () => {
        const path = join(__dirname, "../test-projects/sample-mono-repo");
        const pkg = await readPackageJson(dependencies)(path);
        expect(pkg).toBeDefined();
        if (!pkg) {
            throw new Error("Cannot be null");
        }
        expect(pkg.identifier.name).toBe("sample-mono-repo");
        expect(pkg.dependencies).toEqual([{ name: "lodash", version: "4.17.21" }]);
        expect(pkg.devDependencies).toEqual([{ name: "rimraf", version: "^3.0.2" }]);
        expect(pkg.peerDependencies).toEqual([]);
        expect(pkg.scripts).toEqual([]);
        expect(pkg.packageJson.workspaces).toEqual(["packages/*", "packages/libs/*", "packages/utilities/utility"]);
    });
});

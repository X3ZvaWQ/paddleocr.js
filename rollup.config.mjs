import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: "./src/index.ts",
        output: [
            {
                file: "dist/index.js",
                format: "umd",
                name: "paddleocr",
                sourcemap: !production,
            },
        ],
        external: ["fast-png", "fs/promises"],
        plugins: [
            typescript({
                tsconfig: "./tsconfig.json",
                sourceMap: !production,
                declaration: true,
            }),
            json(),
        ],
    },
];

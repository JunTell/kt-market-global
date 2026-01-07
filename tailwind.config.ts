import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        plugin(function ({ addVariant }) {
            addVariant('lang-ko', '&:lang(ko)');
            addVariant('lang-ja', '&:lang(ja)');
            addVariant('lang-en', '&:lang(en)');

            // Optional: Add group variants if needed
            addVariant('group-lang-ko', ':merge(.group):lang(ko) &');
            addVariant('group-lang-ja', ':merge(.group):lang(ja) &');
        }),
    ],
};
export default config;

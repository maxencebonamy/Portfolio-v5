import pluginJs from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import importSort from "eslint-plugin-import"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import { dirname } from "path"
import tseslint from "typescript-eslint"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sortImportGroupPatterns = [
	[ "^@", "^[a-z]" ],
	[ "^#" ],
	[ "^\\." ]
]

const commonRules = {
	// Spacing
	"@stylistic/arrow-spacing": [ "warn", { before: true, after: true } ],
	"@stylistic/block-spacing": [ "warn", "always" ],
	"@stylistic/computed-property-spacing": [ "warn", "never" ],
	"@stylistic/function-call-spacing": [ "warn", "never" ],
	"@stylistic/generator-star-spacing": [ "warn", "after" ],
	"@stylistic/key-spacing": [ "warn", { mode: "strict" } ],
	"@stylistic/keyword-spacing": [ "warn", { before: true, after: true } ],
	"@stylistic/rest-spread-spacing": [ "warn", "never" ],
	"@stylistic/space-before-blocks": [ "warn", "always" ],
	"@stylistic/switch-colon-spacing": [ "warn", { before: false, after: true } ],
	"@stylistic/template-tag-spacing": [ "warn", "always" ],
	"@stylistic/yield-star-spacing": [ "warn", "after" ],
	"@stylistic/type-generic-spacing": [ "warn" ],
	"@stylistic/type-named-tuple-spacing": [ "warn" ],
	"@stylistic/type-annotation-spacing": [ "warn", { before: false, after: true, overrides: { arrow: "ignore" } } ],

	// Line breaks
	"@stylistic/array-element-newline": [ "warn", "consistent" ],
	"@stylistic/eol-last": [ "warn", "always" ],
	// "@stylistic/function-call-argument-newline": ["warn", "consistent"],
	"@stylistic/implicit-arrow-linebreak": [ "warn", "beside" ],
	"@stylistic/linebreak-style": [ "off" ],
	"@stylistic/lines-between-class-members": [ "warn", "always" ],
	"@stylistic/newline-per-chained-call": [ "off" ],
	"@stylistic/object-property-newline": [ "warn", { allowAllPropertiesOnSameLine: true } ],
	"@stylistic/padding-line-between-statements": [ "off" ],

	// Brackets
	"@stylistic/array-bracket-newline": [ "warn", "consistent" ],
	"@stylistic/array-bracket-spacing": [ "warn", "always" ],
	"@stylistic/arrow-parens": [ "warn", "as-needed" ],
	"@stylistic/brace-style": [ "warn", "1tbs", { allowSingleLine: true } ],
	"@stylistic/function-paren-newline": [ "warn", "consistent" ],
	"@stylistic/new-parens": [ "warn", "always" ],
	"@stylistic/no-extra-parens": [ "warn", "all", {
		nestedBinaryExpressions: false,
		ternaryOperandBinaryExpressions: false,
		ignoreJSX: "all",
		enforceForFunctionPrototypeMethods: false,
		allowParensAfterCommentPattern: "@type"
	} ],
	"@stylistic/object-curly-newline": [ "warn", { consistent: true } ],
	"@stylistic/object-curly-spacing": [ "warn", "always" ],
	"@stylistic/space-before-function-paren": [ "warn", { anonymous: "always", named: "never", asyncArrow: "always" } ],
	"@stylistic/space-in-parens": [ "warn", "never" ],
	"@stylistic/template-curly-spacing": [ "warn", "never" ],
	"@stylistic/wrap-iife": [ "warn", "inside" ],
	"@stylistic/wrap-regex": [ "off" ],

	// Indent
	"@stylistic/indent": [ "warn", "tab" ],
	"@stylistic/indent-binary-ops": [ "warn", "tab" ],

	// Quotes
	"@stylistic/quote-props": [ "warn", "consistent-as-needed" ],
	"@stylistic/quotes": [ "warn", "double" ],

	// Commas
	"@stylistic/comma-dangle": [ "warn", "never" ],
	"@stylistic/comma-spacing": [ "warn", { before: false, after: true } ],
	"@stylistic/comma-style": [ "warn", "last" ],

	// Semis
	"@stylistic/semi": [ "warn", "never" ],
	"@stylistic/no-extra-semi": [ "warn" ],
	"@stylistic/semi-spacing": [ "warn", { before: false, after: true } ],
	"@stylistic/semi-style": [ "warn", "last" ],

	// Operators
	"@stylistic/dot-location": [ "warn", "property" ],
	"@stylistic/multiline-ternary": [ "warn", "always-multiline" ],
	"@stylistic/no-mixed-operators": [ "warn" ],
	"@stylistic/operator-linebreak": [ "warn", "before" ],
	"@stylistic/space-infix-ops": [ "warn" ],
	"@stylistic/space-unary-ops": [ "warn", { words: true, nonwords: false } ],

	// Comments
	"@stylistic/line-comment-position": [ "off" ],
	"@stylistic/lines-around-comment": [ "off" ],
	"@stylistic/multiline-comment-style": [ "warn", "separate-lines" ],
	"@stylistic/spaced-comment": [ "warn", "always" ],

	// Disallow
	"@stylistic/no-confusing-arrow": [ "off" ],
	"@stylistic/no-floating-decimal": [ "warn" ],
	"@stylistic/no-mixed-spaces-and-tabs": [ "warn", "smart-tabs" ],
	"@stylistic/no-multi-spaces": [ "warn" ],
	"@stylistic/no-multiple-empty-lines": [ "warn", { max: 2 } ],
	"@stylistic/no-tabs": [ "off" ],
	"@stylistic/no-trailing-spaces": [ "warn" ],
	"@stylistic/no-whitespace-before-property": [ "warn" ],

	// Misc
	"@stylistic/max-len": [ "warn", { code: 150, comments: 150, ignorePattern: "^\\s*(import|export)\\s" } ],
	"@stylistic/max-statements-per-line": [ "warn", { max: 1 } ],
	"@stylistic/nonblock-statement-body-position": [ "warn", "beside" ],
	"@stylistic/one-var-declaration-per-line": [ "off" ],
	"@stylistic/padded-blocks": [ "warn", { classes: "always", blocks: "never", switches: "never" }, { allowSingleLineBlocks: true } ],
	"@stylistic/member-delimiter-style": [ "warn", {
		multiline: {
			delimiter: "none"
		},
		singleline: {
			delimiter: "comma",
			requireLast: false
		}
	} ],

	// JavaScript
	"eqeqeq": [ "warn", "always" ],
	"no-console": [ "warn" ],

	// TypeScript
	"@typescript-eslint/consistent-type-exports": [ "warn" ],
	"@typescript-eslint/consistent-type-imports": [ "warn", { prefer: "type-imports", fixStyle: "separate-type-imports" } ],
	"@typescript-eslint/consistent-type-definitions": [ "warn", "type" ],
	"@typescript-eslint/no-misused-promises": [ "warn" ],
	"@typescript-eslint/no-floating-promises": [ "warn" ],
	"@typescript-eslint/no-non-null-assertion": [ "warn" ],
	"@typescript-eslint/array-type": [ "warn", { default: "array" } ],
	"@typescript-eslint/prefer-optional-chain": [ "warn" ],
	"@typescript-eslint/no-unused-vars": [ "warn", {
		args: "all",
		argsIgnorePattern: "^_",
		varsIgnorePattern: "^_",
		caughtErrors: "all",
		caughtErrorsIgnorePattern: "^_",
		destructuredArrayIgnorePattern: "^_"
	} ],

	// Imports
	"import/first": "warn",
	"import/newline-after-import": "warn",
	"import/no-duplicates": "warn",
	"import/consistent-type-specifier-style": [ "warn", "prefer-top-level" ],
	"simple-import-sort/imports": [ "warn", { groups: sortImportGroupPatterns } ],
	"simple-import-sort/exports": [ "warn" ]
}

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/playwright-report/**",
			"**/generated/**",
			"**/ui/**",
			"design/**",
			"eslint.config.js",
			"src/routeTree.gen.ts"
		]
	},
	{
		files: [
			"**/*.{js,mjs,cjs,ts}"
		]
	},
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	stylistic.configs.recommended,
	reactHooks.configs.flat.recommended,
	jsxA11y.flatConfigs.recommended,
	{
		plugins: {
			"import": importSort,
			"simple-import-sort": simpleImportSort
		}
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname
			}
		}
	},
	{
		rules: {
			...commonRules,
			"@typescript-eslint/explicit-function-return-type": [ "warn", { allowExpressions: true, allowTypedFunctionExpressions: true } ]
		}
	},
	{
		files: [ "**/*.tsx" ],
		rules: {
			...commonRules,
			"@typescript-eslint/explicit-function-return-type": "off",
			"@stylistic/jsx-indent-props": [ "warn", "tab" ]
		}
	}
]

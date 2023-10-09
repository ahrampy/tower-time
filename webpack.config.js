const path = require("path");
const dotenv = require("dotenv-webpack");

module.exports = {
	entry: "./js/main.js",
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js",
	},
	mode: "production",
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules)/,
			},
		],
	},
	plugins: [new dotenv()],
};

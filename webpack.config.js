const path = require("path");
const dotenv = require("dotenv-webpack");

module.exports = {
	entry: "./js/main.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	mode: "none",
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
	plugins: [new dotenv()],
};

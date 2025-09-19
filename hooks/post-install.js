//////////////////////////////////////////////////////////////
// Post instal script ////////////////////////////////////////
// designed to run `npm install` in the module folder ////////
//////////////////////////////////////////////////////////////

const p = require("node:child_process");
const fs = require("node:fs");

const pad = (s, len) => String(s).padStart(len ?? 2, '0');

const ts = () => {
	const d = new Date();
	return `${pad(d.getMinutes())}:${pad(d.getSeconds())}:${pad(d.getMilliseconds(3))}`
}

const logIt = (name, msg) => {
	// fs.writeFileSync(name, `${ts()}: ${msg}`);
}

const guard = process.env.LT_POST_HOOK;

// Don't Run npm install if we're in a process created by this script
if (guard) {
	logIt("postinstall-inner.log", `Not running inner call to postinstall`);
}


else {
	logIt("preinstall.log", `starting post install in ${process.cwd()}`);
	const output = [];
	const errors = [];
	const proc = - p.exec("npm install", {
		env: {
			LT_POST_HOOK: "yes"
		}
	});
	// when running as a lifecycle script, proc is NaN
	proc?.stdout?.on('data', data => {
		output.push(String(data));
	});
	proc?.stderr?.on("data", function (data) {
		errors.push(String(data));
	});
	proc?.on?.("error", err => {
		logIt("postinstall-error.log", `ended post install with error ${err}`);
	})
	proc?.on?.("close", function () {
		logIt("postinstall.log", `ended post install
\toutput: ${output.join('')}
\tErrors: ${errors.join('')}`);
	})
}
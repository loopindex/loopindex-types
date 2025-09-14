const p = require("child_process");
const fs = require("fs");

const guard = process.env.LT_POST_HOOK;
if (guard) {
	fs.writeFileSync("postinstall-inner.log", `Not running inner call to postinstall`);
}

else {
	fs.writeFileSync("postinstall1.log", `starting post install at ${(new Date()).getMinutes()}:${(new Date()).getSeconds()}`);
	const output = [];
	const errors = [];
	const proc = - p.exec("npm install", {
		env: {
			LT_POST_HOOK: "yes"
		}
	});
	fs.writeFileSync("process-result.log", `Child process: ${proc}/${typeof proc}, on: ${typeof proc?.on} members: ${Object.keys(proc ?? { unknown: "" })}`)
	proc.stdout?.on('data', data => {
		output.push(String(data));
	});
	proc.stderr?.on("data", function (data) {
		errors.push(String(data));
	});
	proc.on?.("error", err => {
		fs.writeFileSync("postinstall-error.log", `ended post install with error ${err}`);
	})
	proc.on?.("close", function () {
		fs.writeFileSync("postinstall2.log", `ended post install at ${(new Date()).getMinutes()}:${(new Date()).getSeconds()}
output: ${output.join('')}\nErrors: ${errors.join('')}`);
	})
}
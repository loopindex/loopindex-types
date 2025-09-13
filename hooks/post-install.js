const p = require("child_process");
const fs = require("fs");

const guard = process.env.LT_POST_HOOK;
fs.writeFileSync("postinstall", `post install at ${(new Date()).getMinutes()}, guard: ${guard}`);
if (!process.env.LT_POST_HOOK) {

    p.spawn("bash", ["npm install"], {
        env: {
            LT_POST_HOOK: "yes"
        }
    })
}
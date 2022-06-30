const { spawn } = require("child_process");
const https = require("https");

https.get("https://api.papermc.io/v2/projects/paper/versions/1.19/builds/", function (response) {
    var body = "";

    response.on("data", function (chunk) {
        body += chunk;
    })

    response.on("end", function () {
        try {
            var json = JSON.parse(body);
            var builds = json.builds;
            var latest_build_number = Math.max(...builds.map(e => e.build));
            var latest_build = builds[builds.findIndex(o => o.build === latest_build_number)];
            var download_link = `https://api.papermc.io/v2/projects/paper/versions/1.19/builds/${latest_build_number}/downloads/${latest_build.downloads.application.name}`
            var wget = spawn(`wget ${download_link} -O paper.jar`)
                .on("error", function (error) {
                    console.error(error.name, error.message)
                })
                .on("close", function (code, signal) {
                    console.log(`wget child process closed with exit code ${code}`)
                });
            wget.stderr.pipe(process.stderr);
            wget.stdout.pipe(process.stdout);
        } catch (error) {
            console.error(error.message);
        }
    })

    response.on("end", function () {
        console.log("response stream ended");
    })
}).on("error", function (error) {
    console.error(error.message);
})
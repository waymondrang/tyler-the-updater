const { spawn, exec } = require("child_process");
const https = require("https");

var spigot_ids = [{
    id: 3709,
    name: "Parties"
}, {
    id: 18494,
    name: "DiscordSRV"
}, {
    id: 62325,
    name: "GSit"
}, {
    id: "28140",
    name: "LuckPerms"
}, {
    id: "81534",
    name: "Chunky"
}]

// download the latest version of papermc

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
            var wget = exec(`wget ${download_link} -nv -O paper.jar`)
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

// download latest essentialsx jar files

https.get("https://ci.ender.zone/job/EssentialsX/lastSuccessfulBuild/api/json", function (response) {
    var body = "";

    response.on("data", function (chunk) {
        body += chunk;
    });

    response.on("end", function () {
        try {
            var json = JSON.parse(body);
            var artifacts = json.artifacts;
            var download_links = [];
            download_links.push("https://ci.ender.zone/job/EssentialsX/lastSuccessfulBuild/artifact/" + artifacts.filter(e => e.fileName.match(/EssentialsX-.*.jar/))[0].relativePath);
            download_links.push("https://ci.ender.zone/job/EssentialsX/lastSuccessfulBuild/artifact/" + artifacts.filter(e => e.fileName.match(/EssentialsXChat-.*.jar/))[0].relativePath);
            for (link in download_links) {
                var wget = exec(`wget ${link} -nv -O essentials.jar`)
                    .on("error", function (error) {
                        console.error(error.name, error.message)
                    })
                    .on("close", function (code, signal) {
                        console.log(`wget child process closed with exit code ${code}`)
                    });
                wget.stderr.pipe(process.stderr);
                wget.stdout.pipe(process.stdout);
            }
        } catch (error) {
            console.error(error.message);
        }
    });

    response.on("end", function () {
        console.log("response stream ended");
    });
})

https.get("https://ci.opencollab.dev//job/GeyserMC/job/Geyser/job/master/lastSuccessfulBuild/api/json", function (response) {
    var body = "";

    response.on("data", function (chunk) {
        body += chunk;
    });

    response.on("end", function () {
        try {
            var json = JSON.parse(body);
            var artifacts = json.artifacts;
            var download_links = [];
            download_links.push("https://ci.opencollab.dev//job/GeyserMC/job/Geyser/job/master/lastSuccessfulBuild/artifact/" + artifacts.filter(e => e.fileName.match(/Geyser-Spigot.jar/))[0].relativePath);
            for (link in download_links) {
                var wget = exec(`wget ${link} -nv`)
                    .on("error", function (error) {
                        console.error(error.name, error.message)
                    })
                    .on("close", function (code, signal) {
                        console.log(`wget child process closed with exit code ${code}`)
                    });
                wget.stderr.pipe(process.stderr);
                wget.stdout.pipe(process.stdout);
            }
        } catch (error) {
            console.error(error.message);
        }
    });

    response.on("end", function () {
        console.log("response stream ended");
    });
})

for (plugin in spigot_ids) {
    var link = `https://api.spiget.org/v2/resources/${plugin.id}/download`
    var wget = exec(`wget ${link} -nv -O ${plugin.name}.jar`)
        .on("error", function (error) {
            console.error(error.name, error.message)
        })
        .on("close", function (code, signal) {
            console.log(`wget child process closed with exit code ${code}`)
        });
    wget.stderr.pipe(process.stderr);
    wget.stdout.pipe(process.stdout);
}
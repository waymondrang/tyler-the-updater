const { spawn, exec } = require("child_process");
const { writeFileSync } = require("fs");
const https = require("https");
const path = require("path");

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

var paper_path = "~/minecraft-server/"

var plugin_path = "~/minecraft-server/plugins/"

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
            var wget = exec(`wget -nvq -O ${paper_path}paper.jar ${download_link}`)
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
            for (link of download_links) {
                var rm = exec(`rm -rf ${plugin_path}EssentialsX-*.jar ${plugin_path}EssentialsXChat-*.jar`)
                    .on("error", function (error) {
                        console.error(error.name, error.message)
                    })
                    .on("close", function (code, signal) {
                        console.log(`rm child process closed with exit code ${code}`)
                    });
                rm.stderr.pipe(process.stderr);
                rm.stdout.pipe(process.stdout);
                var wget = exec(`wget -nvq -P ${plugin_path} ${link}`)
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
            for (link of download_links) {
                var wget = exec(`wget -nvq -O ${plugin_path}Geyser-Spigot.jar ${link}`)
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

for (plugin of spigot_ids) {
    var link = `https://api.spiget.org/v2/resources/${plugin.id}/download`
    var wget = exec(`wget -nvq -O ${plugin_path}${plugin.name}.jar ${link}`)
        .on("error", function (error) {
            console.error(error.name, error.message)
        })
        .on("close", function (code, signal) {
            console.log(`wget child process closed with exit code ${code}`)
        });
    wget.stderr.pipe(process.stderr);
    wget.stdout.pipe(process.stdout);
}

writeFileSync(`${paper_path[0] === '~' ? path.join(process.env.HOME, paper_path.slice(1)) : paper_path}last_updated.txt`, new Date().toISOString(), { encoding: "utf8" });
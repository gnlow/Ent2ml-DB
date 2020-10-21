let users = {}

let dirs = []
for await (const dir of Deno.readDir("./prev")) {
    dirs.push(dir)
}

for (const dir of dirs.sort()) {
    const data = JSON.parse(await Deno.readTextFile(`./prev/${dir.name}`))

    data.forEach(({username, likeCount}) => {
        if (!users[username]) {
            users[username] = {
                start: dirs.length - 1,
                records: []
            }
        }
        users[username].records.push(likeCount - users[username].records.reduce((prev, curr) => prev + curr, 0))
    })
}
Deno.writeTextFile("record.json", JSON.stringify({
    dates: dirs.map(x => x.name.substring(0, x.name.length - 5)),
    users
}))
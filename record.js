let users = {}

let dirs = []
for await (const dir of Deno.readDir("./prev")) {
    dirs.push(dir)
}

let i = 0
for (const dir of dirs.sort()) {
    const data = JSON.parse(await Deno.readTextFile(`./prev/${dir.name}`))

    data.forEach(({username, visitCount, likeCount}) => {
        if (!users[username]) {
            users[username] = {
                start: i,
                visitRecords: [],
                likeRecords: []
            }
        }
        users[username].visitRecords.push(visitCount - users[username].visitRecords.reduce((prev, curr) => prev + curr, 0))
        users[username].likeRecords.push(likeCount - users[username].likeRecords.reduce((prev, curr) => prev + curr, 0))
    })
    i += 1
}
Deno.writeTextFile("record.json", JSON.stringify({
    dates: dirs.map(x => x.name.substring(0, x.name.length - 5)),
    users
}))
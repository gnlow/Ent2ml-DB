let dates = []
let users = {}
for await (const dir of Deno.readDir("./prev")) {
    dates.push(dir.name.substring(0, dir.name.length - 5))
    
    const data = JSON.parse(await Deno.readTextFile(`./prev/${dir.name}`))

    data.forEach(({username, likeCount}) => {
        if (!users[username]) {
            users[username] = {
                start: dates.length - 1,
                records: []
            }
        }
        users[username].records.push(likeCount - users[username].records.reduce((prev, curr) => prev + curr, 0))
    })
}
Deno.writeTextFile("record.json", JSON.stringify({dates, users}))
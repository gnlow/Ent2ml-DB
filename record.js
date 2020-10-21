let dates = []
let users = {}

const sortedInsert = (arr, val) => {
    let low = 0,
        high = arr.length
    while (low < high) {
        let mid = (low + high) >>> 1
        if (arr[mid] < val) low = mid + 1
        else high = mid
    }
    arr.splice(low, 0, val)
}

for await (const dir of Deno.readDir("./prev")) {
    sortedInsert(dates, dir.name.substring(0, dir.name.length - 5))
    
    const data = JSON.parse(await Deno.readTextFile(`./prev/${dir.name}`))

    data.forEach(({username, likeCount}) => {
        if (!users[username]) {
            users[username] = {
                start: dates.length - 1,
                records: []
            }
        }
        sortedInsert(users[username].records, likeCount - users[username].records.reduce((prev, curr) => prev + curr, 0))
    })
}
Deno.writeTextFile("record.json", JSON.stringify({dates, users}))
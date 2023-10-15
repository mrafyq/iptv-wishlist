function save(data) {
    // WEB
    console.log("save data")
    console.log(data)
    // ANDROID
    // App.writeToFile("db.json", JSON.stringify(data));
}

async function read() {
    // WEB
    let response = await fetch('data/db.json')
    return await response.json();
    // ANDROID
    // let str = App.readFromFile("db.json");
    // return JSON.parse(str);
}

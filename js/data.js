function save(data) {
    // WEB
    console.log("save data")
    console.log(data)
    // ANDROID
    // App.writeToFile("db.json", JSON.stringify(data));
}


async function read() {
    // WEB
    var response = await fetch('data/db.json')
    var data = await response.json();
    return data;
    // ANDROID
    // let str = App.readFromFile("db.json");
    // return JSON.parse(str);
}
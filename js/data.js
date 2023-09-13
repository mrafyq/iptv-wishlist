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

function fetchWishlists(wishlists) {
    listFav.innerHTML = '';
    (wishlists).forEach((element, index) => {
        const li = document.createElement('li');
        li.setAttribute('id', element.favori_id);
        li.setAttribute('data-name', element.favori_name);
        li.setAttribute('data-pin', element.pin);
        li.setAttribute('data-order', element.order);
        if (index == 0) {
            li.setAttribute('class', 'favoris selected');
        } else {
            li.setAttribute('class', 'favoris');
        }
        li.style.order = element.order;
        li.innerHTML = element.favori_name;
        if (element.pin) {
            const iconLock = document.createElement('i');
            iconLock.setAttribute('class', 'icon-lock');
            li.appendChild(iconLock);
        }
        listFav.appendChild(li);
    });
}
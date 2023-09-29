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
        li.setAttribute('id', 'wishlits-' + element.favori_id);
        li.setAttribute('data-id', element.favori_id);
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
        console.log(li)
        listFav.appendChild(li);
    });
}

function fetchChannels(channels) {
    listChannels0.innerHTML = '';
    (channels).forEach((element, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-attr-id', element.channel_id);
        li.setAttribute('data-attr-name', element.channel_name);
        li.setAttribute('data-attr-order', element.channel_order);
        li.style.order = element.channel_order
        if (index == 0) {
            li.setAttribute('class', 'channel selected');
        } else {
            li.setAttribute('class', 'channel');
        }
        li.innerHTML = element.channel_name;
        listChannels0.appendChild(li);
    });
}
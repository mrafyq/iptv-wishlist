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

function fetchWishlists(wishlists) {
    listFav.innerHTML = '';
    (wishlists).forEach((element, index) => {
        const li = document.createElement('li');
        li.setAttribute('id', 'wishlits-' + element.wishlist_id);
        li.setAttribute('data-id', element.wishlist_id);
        li.setAttribute('data-name', element.wishlist_name);
        li.setAttribute('data-pin', element.pin);
        li.setAttribute('data-order', element.order);
        if (index == 0) {
            li.setAttribute('class', 'wishlist selected');
        } else {
            li.setAttribute('class', 'wishlist');
        }
        li.style.order = element.order;
        li.innerHTML = element.wishlist_name;
        if (element.pin) {
            const iconLock = document.createElement('i');
            iconLock.setAttribute('class', 'icon-lock');
            li.appendChild(iconLock);
        }
        console.log(li)
        listFav.appendChild(li);
    });
    addActionAddWishlist(wishlists.length)
}

function addActionAddWishlist(count) {
    const li = document.createElement('li');
    li.setAttribute('class', 'action-add-wishlist');
    li.innerHTML = '<i class="icon-add"></i> Ajouter';
    li.style.order = count + 1;
    listFav.appendChild(li);
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
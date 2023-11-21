const wishlistList = document.getElementById('sidebar-wishlist__list');
const listBucket = document.getElementById('sidebar-bucket__list');
const listChannels = document.getElementById('list-channels');

read().then(data => {
    if (data) {
        fetchBuckets(data.buckets);
        fetchWishlists(data.wishlists);
    }
});

function fetchBuckets(buckets) {
    (buckets).forEach((bucket) => {
        if (!bucket.hidden) {
            const li = document.createElement('li');
            li.setAttribute('id', 'bucket-' + bucket.bucket_id);
            li.setAttribute('data-id', bucket.bucket_id);
            li.setAttribute('data-name', bucket.bucket_name);
            li.setAttribute('data-pin', bucket.pin);
            li.setAttribute('class', 'bucket');
            li.innerHTML = bucket.bucket_name;
            if (bucket.pin) {
                const iconLock = document.createElement('i');
                iconLock.setAttribute('class', 'icon-lock');
                li.appendChild(iconLock);
            }
            listBucket.appendChild(li);
        }
    });
}

function fetchWishlists(wishlists) {
    wishlistList.innerHTML = '';
    (wishlists).forEach((wishlist, index) => {
        const li = document.createElement('li');
        li.setAttribute('id', 'wishlist-' + wishlist.wishlist_id);
        li.setAttribute('data-id', wishlist.wishlist_id);
        li.setAttribute('data-name', wishlist.wishlist_name);
        li.setAttribute('data-pin', wishlist.pin);
        li.setAttribute('data-order', wishlist.order);
        if (index == 0) {
            li.setAttribute('class', 'wishlist selected');
        } else {
            li.setAttribute('class', 'wishlist');
        }
        li.style.order = wishlist.order;
        li.innerHTML = wishlist.wishlist_name;
        if (wishlist.pin) {
            const iconLock = document.createElement('i');
            iconLock.setAttribute('class', 'icon-lock');
            li.appendChild(iconLock);
        }
        wishlistList.appendChild(li);
    });
    addActionAddWishlist(wishlists.length)
}

function addActionAddWishlist(count) {
    const li = document.createElement('li');
    li.setAttribute('class', 'action-add-wishlist');
    li.innerHTML = '<i class="icon-add"></i> Ajouter';
    li.style.order = count + 1;
    wishlistList.appendChild(li);
    createWishlistAddEvent(li)
}

function fetchChannels(channels) {
    listChannels.innerHTML = '';
    (channels).forEach((channel, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-attr-id', channel.channel_id);
        li.setAttribute('data-attr-name', channel.channel_name);
        li.setAttribute('data-attr-order', channel.channel_order);
        li.style.order = channel.channel_order
        if (index == 0) {
            li.setAttribute('class', 'channel selected');
        } else {
            li.setAttribute('class', 'channel');
        }
        li.innerHTML = channel.channel_name;
        listChannels.appendChild(li);
    });
}
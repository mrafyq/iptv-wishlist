let popupAddWishlist = document.querySelector('.popup-add-wishlist');
let popupWishlistForm = document.querySelector('.popup-add-wishlist form');
let inputAdd = document.querySelector('.popup.popup-add-wishlist #add');

popupWishlistForm.addEventListener('submit', (e) => {
    e.preventDefault()
    read().then(data => {
        if (data) {
            const ids = data.wishlists.map(wishlist => wishlist.wishlist_id);
            const sorted = ids.sort((a, b) => a - b);
            let nextId = sorted[sorted.length - 1] + 1;
            data.wishlists.push({
                "wishlist_id": nextId,
                "wishlist_name": inputAdd.value,
                "order": data.wishlists.length,
                "pin": 0,
                "channels": []
            })
            if (popupAction === true) {
                // create element without fetch
                const li = document.createElement('li');
                li.setAttribute('id', 'wishlist-' + nextId);
                li.setAttribute('data-id', nextId);
                li.setAttribute('data-name', inputAdd.value);
                li.setAttribute('data-pin', 0);
                li.setAttribute('data-order', data.wishlists.length);
                li.setAttribute('class', 'wishlists');
                li.style.order = data.wishlists.length;
                li.innerHTML = inputAdd.value;
                fetchWishlists(data.wishlists)
                save(data);
                adaptPopup(popupAddWishlist)
                wishlistActions.style.display = 'flex'
            }
        }
    })
})

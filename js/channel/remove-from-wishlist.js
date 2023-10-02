let popupRemoveFromWishlistForm = document.getElementById('remove-from-wishlist-form');
// Submit form remove channel item from wishlist
popupRemoveFromWishlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let wishlistChannelSelected = document.querySelector('.list-channels .channel.selected');
    let wishlistSelected = document.querySelector('.group-name');
    let popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');// wishlistChannelSelected.remove();
    read().then(data => {
        if (data) {
            let getFav = data.wishlists.filter(item => item.wishlist_id == wishlistSelected.id);
            let getFavChannels = getFav[0].channels.filter(item => item.channel_id != wishlistChannelSelected.getAttribute('data-attr-id'));
            let wishlistChannel = document.querySelectorAll('.list-channels .channel');
            wishlistChannel[0].classList.add('selected');
            getFav[0].channels = getFavChannels;
            save(data);
            wishlistChannelSelected.remove()
            adaptPopup(popupRemoveFromWishlist)
        }
    })
})
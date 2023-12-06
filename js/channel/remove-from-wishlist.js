
function callPopupRemoveChannel() {
    let groupNameSelected = document.querySelector('.group-name');
    if (groupNameSelected.getAttribute('list-selected') === 'wishlists') {
        let wishlist_selected = document.querySelector('.group-name');
        let wishlistChannelSelected = document.querySelector('.list-channels .channel.selected');
        let popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');
        let popupRemoveFromWishlistTitle = document.querySelector('.popup-remove-from-wishlist .popup__title');
        // Popup title => Wishlist
        popupRemoveFromWishlistTitle.innerHTML = 'Etes vous sur de vouloir supprimer <strong>' +
            wishlistChannelSelected.getAttribute('data-attr-name') +
            '</strong> depuis <strong>' + wishlist_selected.textContent + '</strong> ?'
        // Show popup remove channel item from wishlist
        popupRemoveFromWishlist.classList.add('active');
        return true
    }
    return false
}

let popupRemoveFromWishlistForm = document.getElementById('remove-from-wishlist-form');
// Submit form remove channel item from wishlist

popupRemoveFromWishlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let wishlistChannelSelected = document.querySelector('.list-channels .channel.selected');
    let wishlistSelected = document.querySelector('.group-name');
    let popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');
    read().then(data => {
        if (data) {
            let wishlist = data.wishlists.filter(item => item.wishlist_id == wishlistSelected.id);
            wishlist[0].channels = wishlist[0].channels.filter(item => item.channel_id != wishlistChannelSelected.getAttribute('data-attr-id'));
            save(data);
            wishlistChannelSelected.remove()
            selectChannelAfterRemove()
            adaptPopup(popupRemoveFromWishlist)
        }
    })
})

function selectChannelAfterRemove() {
    channels[0].classList.add('selected');
    channelSelected = null
    manageChannelsAction(false)
}
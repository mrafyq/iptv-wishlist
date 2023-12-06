Array.from(tabs).forEach(tab => {
    tab.addEventListener('click', function (event) {
        let tabToInactive, listToHide, listToShow = tab.getAttribute('data-list')
        if (listToShow === 'list-bucket') {
            listToHide = 'list-wishlist'
            tabToInactive = 'tab-wishlist'
        } else {
            listToHide = 'list-bucket'
            tabToInactive = 'tab-bucket'
        }
        tab.classList.add('selected')
        document.querySelector('.' + tabToInactive).classList.remove('selected', 'active')
        document.querySelector('.' + listToHide).style.display = 'none'
        document.querySelector('.' + listToShow).style.display = 'flex'
        escapeBucketsOrWishlists()
    })
})


function switchBucketsWishlist(current_index) {
    if (currentList[current_index].getAttribute('data-list') === 'list-wishlist') {
        list_selected = 'wishlists';
        currentList[current_index].classList.remove('selected');
        currentList[current_index].classList.add('active');
        currentList = wishlist;
        wishlistActions.style.display = 'flex';
        bucketsButtons.style.display = 'none';
    } else {
        list_selected = 'buckets';
        currentList[current_index].classList.remove('selected');
        currentList[current_index].classList.add('active');
        currentList = buckets;
        bucketsButtons.style.display = 'flex';
        wishlistActions.style.display = 'none';
    }
}
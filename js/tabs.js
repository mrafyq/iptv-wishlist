function switchBucketsWishlist(current_index) {
    if (currentList[current_index].getAttribute('data-list') === 'list-wishlist') {
        list_selected = 'wishlists';
        currentList[current_index].classList.remove('selected');
        currentList[current_index].classList.add('active');
        currentList = wishlist;
        wishlistActions.style.display = 'flex';
        document.getElementById('buckets-buttons').style.display = 'none';
    } else {
        list_selected = 'buckets';
        currentList[current_index].classList.remove('selected');
        currentList[current_index].classList.add('active');
        currentList = buckets;
        document.getElementById('buckets-buttons').style.display = 'flex';
        wishlistActions.style.display = 'none';
    }
}
function manageChannelsAction(show = true) {
    let channelsListingActions = document.querySelectorAll('.channels-list-action')
    for (let action of channelsListingActions) {
        action.style.display = show ? 'none' : 'block';
    }
    let channelsActions = document.querySelectorAll('.channels-action')
    for (let action of channelsActions) {
        let groupType = document.querySelector('.group-name').getAttribute('list-selected');
        if (action.classList.contains('remove-from-wishlist') && groupType === 'buckets') {
            continue
        }
        action.style.display = show ? 'block' : 'none';
    }
}
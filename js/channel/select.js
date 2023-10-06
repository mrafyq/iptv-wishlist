const channelsActions = document.querySelectorAll('.channels-action')

function manageChannelsAction(show = true, excludedActionsByClass = []) {
    let channelsListingActions = document.querySelectorAll('.channels-list-action')
    for (let action of channelsListingActions) {
        action.style.display = show ? 'none' : 'block';
    }

    for (let action of channelsActions) {
        let groupType = document.querySelector('.group-name').getAttribute('list-selected');
        if (action.classList.contains('remove-from-wishlist') && groupType === 'buckets') {
            continue
        }
        action.style.display = show ? 'block' : 'none';
    }
}

function hideChannelsActionForMove(hideMoveButton = false) {
    for (let action of channelsActions) {
        if (action.classList.contains('move-channel-action') && !hideMoveButton) {
            continue
        }
        action.style.display = 'none';
    }
}
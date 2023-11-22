const channelsActions = document.querySelectorAll('.channels-action')
const selectChannelAction = document.querySelector('.select-channel-action')
const unselectChannelAction = document.querySelector('.unselect-channel-action')

selectChannelAction.addEventListener('click', function () {
    let current_index = getCurrentIndex()
    if (!channelSelected) {
        channelSelected = currentList[current_index]
        // init order listing
        let getAllChannels = document.querySelectorAll('#list-channels .channel');
        listChannels.innerHTML = '';
        let normalArr= getChannels(getAllChannels);
        normalArr.sort((a, b) => {
            return a.channel_order < b.channel_order ? -1 : 0;
        })
        fetchChannelsOrdered(normalArr, sortLabel, 'Normal', channelSelected, true)
        sortAscDesc = 0;
        manageChannelsAction(true)
    }
})

unselectChannelAction.addEventListener('click', function () {
    let current_index = getCurrentIndex()
    if (channelSelected) {
        currentList[current_index].innerHTML = currentList[current_index].getAttribute('data-attr-name');
        currentList[current_index].classList.remove('checked')
        channelSelected = null
        manageChannelsAction(false)
    }
})

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
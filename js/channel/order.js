
const sortChannelAction = document.querySelector('.sort-channel-action')

sortChannelAction.addEventListener('click', function () {
    let current_index = getCurrentIndex()
    let current = currentList[current_index]
    let getAllChannels = document.querySelectorAll('#list-channels .channel');
    listChannels.innerHTML = '';

    if (sortAscDesc === 0 || sortAscDesc === 1) {
        let newArr = getChannels(getAllChannels);
        newArr.sort((a, b) => {
            if (a.channel_name < b.channel_name) {
                return -1;
            }
            if (a.channel_name > b.channel_name) {
                return 1;
            }
            return 0;
        });
        if (sortAscDesc === 0) {
            fetchChannelsOrdered(newArr, sortLabel, 'A-Z', current)
            sortAscDesc = 1;
        } else if (sortAscDesc === 1) {
            newArr.reverse();
            fetchChannelsOrdered(newArr, sortLabel, 'Z-A', current)
            sortAscDesc = 2;
        }
    } else if (sortAscDesc === 2) {
        let normalArr= getChannels(getAllChannels);
        normalArr.sort((a, b) => {
            return a.channel_order < b.channel_order ? -1 : 0;
        })
        fetchChannelsOrdered(normalArr, sortLabel, 'Normal', current)
        sortAscDesc = 0;
    }
})

function getChannels(getAllChannels) {
    const channels = []
    getAllChannels.forEach(el => {
        let channelId = el.getAttribute('data-attr-id');
        let channelName = el.getAttribute('data-attr-name');
        let channelOrder = el.getAttribute('data-attr-order');
        channels.push({
            "channel_id": parseInt(channelId),
            "channel_name": channelName,
            "channel_order": parseInt(channelOrder)
        });
    });
    listChannels.innerHTML = ''
    return channels;
}

function fetchChannelsOrdered(channels, sortLabel, sortValue, selected = null, toSelect = false) {
    channels.forEach((element, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-attr-id', element.channel_id);
        li.setAttribute('data-attr-name', element.channel_name);
        li.setAttribute('data-attr-order', element.channel_order);
        if (sortValue === 'Normal') {
            li.style.order = element.channel_order
        }
        li.innerHTML = element.channel_name;
        if (selected && parseInt(selected.getAttribute('data-attr-id')) === element.channel_id) {
            if (toSelect) {
                li.setAttribute('class', 'channel checked selected');
                const icon = document.createElement('i');
                const svgCheckIcon = `
                    <svg class="checkbox-checked" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                    </svg>
                `;
                icon.innerHTML = svgCheckIcon;
                li.appendChild(icon);
            } else {
                li.setAttribute('class', 'channel selected');
            }
        } else if (index === 0 && !selected) {
            li.setAttribute('class', 'channel selected');
        } else {
            li.setAttribute('class', 'channel');
        }
        listChannels.appendChild(li);
        createChannelEventClick(li)
    });
    sortLabel.textContent = '(' + sortValue + ')';
}

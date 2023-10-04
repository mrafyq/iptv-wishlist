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
    listChannels0.innerHTML = ''
    return channels;
}

function fetchChannelsOrdered(channels, sortLabel, sortValue, selected = null) {
    channels.forEach((element, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-attr-id', element.channel_id);
        li.setAttribute('data-attr-name', element.channel_name);
        li.setAttribute('data-attr-order', element.channel_order);
        if (sortValue === 'Normal') {
            li.style.order = element.channel_order
        }
        if (selected && parseInt(selected.getAttribute('data-attr-id')) === element.channel_id) {
            li.setAttribute('class', 'channel selected');
        } else if (index === 0 && !selected) {
            li.setAttribute('class', 'channel selected');
        } else {
            li.setAttribute('class', 'channel');
        }
        li.innerHTML = element.channel_name;
        listChannels0.appendChild(li);
    });
    sortLabel.textContent = '(' + sortValue + ')';
}

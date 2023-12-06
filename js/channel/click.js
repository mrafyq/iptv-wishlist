function initChannelClasses() {
    for (let channel of channels) {
        if (channel.classList.contains('selected')) {
            channel.classList.remove('selected')
        }
    }
}

function createChannelEventClick(channel) {
    channel.addEventListener('click', function handleClick(event) {
        initChannelClasses()
        if (channel.classList.contains('selected')) {
            channel.classList.remove('selected');
        } else {
            channel.classList.add('selected');
        }
        if (generalMoveAction) {
            manageMove(channel)
        }
    })
}
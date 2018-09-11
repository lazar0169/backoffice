let iconData = {
    icon: '<span class="mdi mdi-hexagon-outline" id="hexagon"></span>'
}

// Define 'init' event
on('init', function (data) {
    let welcomeMessage = `WELCOME TO HEXW${data.icon}RKS`;
    $$('#label').innerHTML = welcomeMessage;
}, 1);

// Trigger the 'init' event and pass data
trigger('init', iconData);
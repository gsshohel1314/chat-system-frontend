// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// window.Pusher = Pusher;

// const echo = new Echo({
//   broadcaster: 'pusher',
//   key: 'bdd412b484f31b4f3483',
//   cluster: 'ap2',
//   forceTLS: true,
//   encrypted: true,
//   authEndpoint: 'http://localhost:8000/broadcasting/auth', // Adjust if necessary
// });

// export default echo;


import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'bdd412b484f31b4f3483',
    cluster: 'ap2',
    encrypted: true,
});

export default echo;


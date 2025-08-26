import { createMessage } from './message.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  if (app) {
    app.textContent = createMessage('World');
  }
});

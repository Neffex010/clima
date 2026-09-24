import './styles/tokens.css';
import './styles/main.css';
import './styles/components.css';
import { App } from './core/App.js';

const root = document.getElementById('app');
if (root) {
  const app = new App(root);
  app.start();
}
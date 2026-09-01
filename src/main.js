import './styles/main.css';
import { store } from './state/store.js';

import { renderWelcome } from './stages/01_Welcome.js';
import { renderHygiene } from './stages/02_Hygiene.js';
import { renderSupermarket } from './stages/03_Supermarket.js';
import { renderDigestionJourney } from './stages/04_DigestionJourney.js';
import { renderSummaryReport } from './stages/05_SummaryReport.js';

const app = document.getElementById('app');

function renderApp(state) {
  app.innerHTML = ''; // clear current stage
  let stageElement;

  switch(state.stage) {
    case '01_Welcome':
      stageElement = renderWelcome();
      break;
    case '02_Hygiene':
      stageElement = renderHygiene();
      break;
    case '03_Supermarket':
      stageElement = renderSupermarket();
      break;
    case '04_DigestionJourney':
      stageElement = renderDigestionJourney();
      break;
    case '05_SummaryReport':
      stageElement = renderSummaryReport();
      break;
    default:
      stageElement = document.createElement('div');
      stageElement.innerText = 'Unknown Stage';
  }

  app.appendChild(stageElement);
}

// Subscribe to store changes and trigger re-renders
store.subscribe((state) => {
  renderApp(state);
});

// Initial Render
renderApp(store.state);

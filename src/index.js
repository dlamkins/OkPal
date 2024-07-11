import './styles/tailwind.css';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import OptionsView from './options/OptionsView';

const hasOptionsParam = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('options') === '1';
};

const container = document.getElementById('root');
const root = createRoot(container);

const componentToRender = hasOptionsParam() ? <OptionsView /> : <Popup />;
root.render(componentToRender);

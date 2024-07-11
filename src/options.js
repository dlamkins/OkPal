import './styles/tailwind.css';
import { createRoot } from 'react-dom/client';
import OptionsView from './options/OptionsView';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<OptionsView />);
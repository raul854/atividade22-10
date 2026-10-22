import { useEffect } from 'react';
import { apiGet } from './api';

export default function App() {
  useEffect(() => {
    apiGet('/users').then((dados) => console.log(dados));
  }, []);

  return <h1>Atividade 22/10</h1>;
}

export const BASE_URL = 'http://localhost:3000';

export async function requisicao(caminho, opcoes = {}) {
  const resp = await fetch(`${BASE_URL}${caminho}`, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  if (resp.status === 204) return null;
  return resp.json();
}

export function apiGet(caminho, opcoes = {}) {
  return requisicao(caminho, { ...opcoes, method: 'GET' });
}

export function apiPost(caminho, dados, opcoes = {}) {
  return requisicao(caminho, {
    ...opcoes,
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function apiPut(caminho, dados, opcoes = {}) {
  return requisicao(caminho, {
    ...opcoes,
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export function apiDelete(caminho, opcoes = {}) {
  return requisicao(caminho, { ...opcoes, method: 'DELETE' });
}

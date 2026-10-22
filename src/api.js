export const BASE_URL = 'http://localhost:3000';

export class ApiError extends Error {
  constructor(status, statusText) {
    super(`${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

export async function requisicao(caminho, opcoes = {}) {
  const { headers: headersDaChamada, ...resto } = opcoes;

  const resp = await fetch(`${BASE_URL}${caminho}`, {
    ...resto,
    headers: {
      'Content-Type': 'application/json',
      ...headersDaChamada,
    },
  });

  if (!resp.ok) {
    throw new ApiError(resp.status, resp.statusText);
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

export function mensagemDeErro(erro) {
  if (erro instanceof ApiError) {
    if (erro.status === 404) return 'Recurso não encontrado';
    if (erro.status >= 500) return 'Erro no servidor';
    return `Erro ${erro.status}: ${erro.statusText}`;
  }
  if (erro instanceof TypeError) return 'Falha de rede';
  return 'Erro inesperado';
}

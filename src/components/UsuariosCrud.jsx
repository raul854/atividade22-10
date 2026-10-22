import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, mensagemDeErro } from '../api';

const FORM_VAZIO = { nome: '', email: '' };

export default function UsuariosCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        const dados = await apiGet('/users', { signal: controller.signal });
        console.log(dados);
        setUsuarios(dados);
      } catch (e) {
        if (e.name === 'AbortError') return;
        setErro(mensagemDeErro(e));
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregar();
    return () => controller.abort();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editandoId) {
        const atualizado = await apiPut(`/users/${editandoId}`, form);
        setUsuarios(usuarios.map((u) => (u.id === editandoId ? atualizado : u)));
      } else {
        const criado = await apiPost('/users', form, {
          headers: { 'X-Custom': 'aula07' },
        });
        setUsuarios([...usuarios, criado]);
      }
      setForm(FORM_VAZIO);
      setEditandoId(null);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  function iniciarEdicao(usuario) {
    setEditandoId(usuario.id);
    setForm({ nome: usuario.nome, email: usuario.email });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(FORM_VAZIO);
  }

  async function excluir(id) {
    setErro('');
    try {
      await apiDelete(`/users/${id}`);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Usuários</h1>

      {erro && <p style={{ color: 'crimson' }}>{erro}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
        <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
        <button type="submit">{editandoId ? 'Salvar' : 'Adicionar'}</button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicao}>Cancelar</button>
        )}
      </form>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>
              {u.nome} — {u.email}{' '}
              <button onClick={() => iniciarEdicao(u)}>Editar</button>{' '}
              <button onClick={() => excluir(u.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

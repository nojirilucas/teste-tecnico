import { useState, useEffect, type FormEvent } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    fetch('http://localhost:3333/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const response = await fetch('http://localhost:3333/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age: Number(age) }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
      } else {
        setUsers([...users, data]);
        setName(''); setEmail(''); setAge('');
      }
    } catch (error) {
      alert("Erro ao conectar no servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-4 font-sans">
      
      {/* Cabeçalho */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Cadastro de Devs
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Teste Técnico Full Stack</p>
      </div>
      
      {/* Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Novo Usuário
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
              <input 
                className={`w-full bg-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`}
                placeholder="Ex: Lucas Nojiri"
                value={name} onChange={e => setName(e.target.value)} 
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
              <input 
                className={`w-full bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`}
                placeholder="Ex: email@exemplo.com"
                value={email} onChange={e => setEmail(e.target.value)} 
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Idade</label>
              <input 
                type="number"
                className={`w-full bg-slate-900 border ${errors.age ? 'border-red-500' : 'border-slate-700'} rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`}
                placeholder="Ex: 25"
                value={age} onChange={e => setAge(e.target.value)} 
              />
              {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age[0]}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cadastrando..." : "Confirmar Cadastro"}
            </button>
          </form>
        </div>

        {/* Lado Direito */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Membros ({users.length})</h2>
            <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">Em tempo real</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-600">
            {users.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                <p>Nenhum registro ainda.</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-colors flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                  <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    <span className="text-sm font-mono text-cyan-400">{user.age}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
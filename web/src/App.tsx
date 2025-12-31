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
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    fetch('http://localhost:3333/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Erro ao buscar usuários:", err));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const response = await fetch('http://localhost:3333/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, age: Number(age) }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        setErrors(data.errors);
      } else {
        alert("Erro desconhecido");
      }
    } else {
      setUsers([...users, data]);
      setName(''); setEmail(''); setAge('');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Cadastro de Usuários</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input 
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: João Silva"
            value={name} onChange={e => setName(e.target.value)} 
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: joao@email.com"
            value={email} onChange={e => setEmail(e.target.value)} 
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Idade</label>
          <input 
            type="number"
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 25"
            value={age} onChange={e => setAge(e.target.value)} 
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age[0]}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold">
          Cadastrar
        </button>
      </form>
      <div className="mt-10 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Usuários Cadastrados ({users.length})</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum usuário cadastrado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {users.map(user => (
              <li key={user.id} className="bg-white p-4 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                  {user.age} anos
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
app.use(express.json());
app.use(cors());

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

const users: User[] = [];

const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().min(18, "Idade deve ser maior ou igual a 18"),
});

app.get('/users', (req, res) => {
  return res.json(users);
});

app.post('/users', (req, res) => {
  try {
    const data = userSchema.parse(req.body);
    const newUser = { id: crypto.randomUUID(), ...data };
    users.push(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    return res.status(500).json({ error: "Erro interno" });
  }
});

app.listen(3333, () => console.log('Server rodando na porta 3333'));

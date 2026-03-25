import React, { useState } from 'react';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';

// =================== Типи ===================
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user: User;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [title, setTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState<number | ''>('');
  const [errors, setErrors] = useState({ title: '', user: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { title: '', user: '' };

    if (!title) {
      newErrors.title = 'Please enter a title';
    }

    if (!selectedUser) {
      newErrors.user = 'Please choose a user';
    }

    setErrors(newErrors);
    if (newErrors.title || newErrors.user) {
      return;
    }

    const user = usersFromServer.find(u => u.id === selectedUser)!;

    const newTodo: Todo = {
      id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      title,
      completed: false,
      userId: user.id,
      user,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setSelectedUser('');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={e => {
              // Лише літери ua/en, цифри та пробіли
              setTitle(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ''));
              if (errors.title) {
                setErrors({ ...errors, title: '' });
              }
            }}
            placeholder="Enter todo title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectedUser}
            onChange={e => {
              setSelectedUser(Number(e.target.value));
              if (errors.user) {
                setErrors({ ...errors, user: '' });
              }
            }}
          >
            <option value="" disabled>
              Choose a user
            </option>
            {usersFromServer.map((u: User) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.user && <span className="error">{errors.user}</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};

import React, { useState } from 'react';
import { User, Todo } from './types';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [title, setTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState<number | ''>('');
  const [errors, setErrors] = useState({ title: '', user: '' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors = { title: '', user: '' };

    // Валідація
    if (!title.trim()) newErrors.title = 'Please enter a title';
    if (!selectedUser) newErrors.user = 'Please choose a user';

    setErrors(newErrors);
    if (newErrors.title || newErrors.user) return;

    // Знаходимо об’єкт користувача
    const selectedUserObject = usersFromServer.find(
      u => u.id === selectedUser
    );

    if (!selectedUserObject) return; // безпечне використання

    const newTodo: Todo = {
      id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      title,
      completed: false,
      userId: selectedUserObject.id,
      user: selectedUserObject,
    };

    // Додаємо новий todo
    setTodos([...todos, newTodo]);

    // Очищаємо форму
    setTitle('');
    setSelectedUser('');
    setErrors({ title: '', user: '' });
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
            onChange={event => {
              // Лише літери ua/en, цифри та пробіли
              setTitle(event.target.value.replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ''));
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder="Enter todo title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectedUser}
            onChange={event => {
              setSelectedUser(Number(event.target.value));
              if (errors.user) setErrors({ ...errors, user: '' });
            }}
          >
            <option value="" disabled>
              Choose a user
            </option>
            {usersFromServer.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.name}
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

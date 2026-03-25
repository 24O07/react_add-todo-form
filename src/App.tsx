import React, { useState } from 'react';
import { User, Todo } from './types';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [title, setTitle] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [errors, setErrors] = useState({ title: '', user: '' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 

    const newErrors = { title: '', user: '' };

    if (!title) {
      newErrors.title = 'Please enter a title';
    }

    if (!selectedUserId) {
      newErrors.user = 'Please choose a user';
    }

    setErrors(newErrors);

    // якщо є помилки — не продовжуємо
    if (newErrors.title || newErrors.user) {
      return;
    }

    const selectedUser = usersFromServer.find(
      (user: User) => user.id === selectedUserId,
    );

    if (!selectedUser) {
      return;
    }

    const newTodo: Todo = {
      id: todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
      title,
      completed: false,
      userId: selectedUser.id,
      user: selectedUser,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setSelectedUserId('');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>


        <div className="field">
          <label htmlFor="title">Todo title</label>

          <input
            id="title"
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={event => {
              setTitle(event.target.value.replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ''));
              if (errors.title) {
                setErrors({ ...errors, title: '' });
              }
            }}
            placeholder="Enter todo title"
          />

          {errors.title && (
            <span className="error" data-cy="titleError">
              {errors.title}
            </span>
          )}
        </div>


        <div className="field">
          <label htmlFor="user">User</label>

          <select
            id="user"
            data-cy="userSelect"
            value={selectedUserId}
            onChange={event => {
              setSelectedUserId(Number(event.target.value));
              if (errors.user) {
                setErrors({ ...errors, user: '' });
              }
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

          {errors.user && (
            <span className="error" data-cy="userError">
              {errors.user}
            </span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};

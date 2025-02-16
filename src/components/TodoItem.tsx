import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo?: (todoId: number) => void;
  isProcessed: boolean;
  tempTodo?: boolean;
  updateTodo: (todo: Todo) => void;
};

const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isProcessed,
  tempTodo,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo && handleDeleteTodo(todo.id);

      return;
    }

    updateTodo({ ...todo, title: trimmedTitle });
    setIsEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
        />
        <span className="visually-hidden">Mark as completed</span>
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={handleChange}
          className="todo__input"
          data-cy="TodoInput"
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo && handleDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed || tempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default React.memo(TodoItem);

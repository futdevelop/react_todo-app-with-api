import React, { FormEvent, useEffect, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import Footer from './components/Footer';
import Header from './components/Header';
import ErrorMessage from './components/ErrorMessage';
import TodoList from './components/TodoList';

enum ErrorMessages {
  UnableToLoad = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  UnadleToAdd = 'Unable to add a todo',
  UnableToDelete = 'Unable to delete a todo',
  UnableToUpdate = 'Unable to update a todo',
}

export enum Filters {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [disabledTitle, setDisabledTitle] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [processings, setProcessings] = useState<number[]>([]);

  const [countOfCompTodos, setCountOfCompTodos] = useState(0);

  useEffect(() => {
    if (todos) {
      const filteredTodosByCompletion = todos.filter(
        (todo: Todo) => todo.completed,
      );

      setCountOfCompTodos(filteredTodosByCompletion.length);
    }
  }, [todos]);

  useEffect(() => {
    if (countOfCompTodos) {
      // console.log(countOfCompTodos, 'countOfCompTodos app');
      // console.log(todos.length, 'lengthOfTodos')
    }
  }, [countOfCompTodos]);

  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const inputRef = useRef<HTMLInputElement>(null);

  function getVisibleTodos() {
    return todos.filter(todo => {
      switch (selectedFilter) {
        case 'completed':
          return todo.completed;
        case 'active':
          return !todo.completed;
        case 'all':
        default:
          return true;
      }
    });
  }

  const visibleTodos = getVisibleTodos();

  useEffect(() => {
    getVisibleTodos();
  }, [selectedFilter]);

  const handleError = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const fetchTodos = () => {
    getTodos()
      .then((res: Todo[]) => setTodos(res))
      .catch(() => handleError(ErrorMessages.UnableToLoad));
  };

  useEffect(() => fetchTodos(), []);

  const handleSelectedFilter = (filter: string) => setSelectedFilter(filter);

  const handleTitleChange = (ch: string) => setTitle(ch);

  const deleteErrorMessage = () => setErrorMessage('');

  const itemsLeft = todos.length - countOfCompTodos;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setDisabledTitle(true);

    if (!title.trim()) {
      setTitle(prevTitle => prevTitle.trim());
      handleError(ErrorMessages.EmptyTitle);
      setTimeout(() => inputRef.current?.focus(), 0);

      setDisabledTitle(false);

      return;
    }

    setTempTodo({
      title,
      id: Math.random(),
      completed: false,
      userId: USER_ID,
    });

    addTodo({ title, completed: false, userId: USER_ID })
      .then(data => {
        setTodos(prevTodos => [...prevTodos, { ...data }]);
        setTitle('');
      })
      .catch(() => handleError(ErrorMessages.UnadleToAdd))
      .finally(() => {
        setDisabledTitle(false);
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessings((prevProcessings: number[]) => [...prevProcessings, todoId]);

    deleteTodo(todoId)
      .then(() => {
        fetchTodos();
      })
      .catch(() => handleError(ErrorMessages.UnableToDelete));
  };

  const clearCompletedTodos = () => {
    todos.map((todo: Todo) => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });

    setCountOfCompTodos(0);
  };

  const toggleTodosStatus = () => {
    const atLeastOneCompletedTodo: boolean = todos.some(
      (todo: Todo) => !todo.completed,
    );

    todos.map((todo: Todo) => {
      if (todo.completed === !atLeastOneCompletedTodo) {
        updateTodo(todo.id, { ...todo, completed: atLeastOneCompletedTodo })
          .then(res => {
            fetchTodos();
          })
          .catch(() => handleError(ErrorMessages.UnableToUpdate));
      }
    });
  };

  const handleUpdateTodo = (todo: Todo) => {
    updateTodo(todo.id, { ...todo, completed: !todo.completed })
      .then(res => {
        fetchTodos();
      })
      .catch(() => handleError(ErrorMessages.UnableToUpdate));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          disabledTitle={disabledTitle}
          title={title}
          handleTitleChange={handleTitleChange}
          allTodosCompleted={todos.length === countOfCompTodos}
          toggleTodosStatus={toggleTodosStatus}
        />

        <TodoList
          processings={processings}
          visibleTodos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          updateTodo={(todo: Todo) => handleUpdateTodo(todo)}
        />

        {todos.length > 0 && (
          <Footer
            countOfCompTodos={countOfCompTodos}
            itemsLeft={itemsLeft}
            selectedFilter={selectedFilter}
            handleSelectedFilter={handleSelectedFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>
      <ErrorMessage
        errorMessage={errorMessage}
        deleteErrorMessage={deleteErrorMessage}
      />
    </div>
  );
};

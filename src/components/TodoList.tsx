import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  processings: number[];
  handleDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null | undefined;
  updateTodo: (todo: Todo) => void
};

const TodoList: React.FC<Props> = ({
  visibleTodos,
  processings,
  handleDeleteTodo,
  tempTodo,
  updateTodo
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isProcessed={processings.includes(todo.id)}
              handleDeleteTodo={() => handleDeleteTodo(todo.id)}
              updateTodo={(gotTodo) => updateTodo(gotTodo)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isProcessed updateTodo={(todo) => updateTodo(todo)} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;
import { FormEvent, RefObject } from 'react';

type Props = {
  handleSubmit: (e: FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  disabledTitle: boolean;
  title: string;
  handleTitleChange: (ch: string) => void;
  allTodosCompleted: boolean
  toggleTodosStatus: () => void
};

const Header: React.FC<Props> = ({
  handleSubmit,
  inputRef,
  disabledTitle,
  title,
  handleTitleChange,
  allTodosCompleted,
  toggleTodosStatus
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allTodosCompleted && 'active'}`}
        data-cy="ToggleAllButton"
        onClick={toggleTodosStatus}
      />

      <form onSubmit={e => handleSubmit(e)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          disabled={disabledTitle}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;

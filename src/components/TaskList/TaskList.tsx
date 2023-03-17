import PropTypes from 'prop-types'
import { Todo } from '../../@types/todo.type'
import { todoPropTypes } from '../../PropTypes/todo.proptypes'
import styles from './taskList.module.scss'

interface TaskListProps {
  doneTaskList?: boolean
  todos: Todo[]
  changeStatusTodo: (id: string, done: boolean) => void
  startEditTodo: (id: string) => void
  deleteTodo: (id: string) => void
}
export default function TaskList(props: TaskListProps) {
  const { doneTaskList, todos, changeStatusTodo, startEditTodo, deleteTodo } = props

  const onChangeCheckbox = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    changeStatusTodo(id, e.target.checked)
  }
  return (
    <div>
      <h2 className={styles.title}>{doneTaskList ? 'Hoàn thành' : 'Chưa hoàn thành'}</h2>
      <div className={styles.tasks}>
        {todos.length > 0 &&
          todos.map((todo) => (
            <div className={styles.task} key={todo.id}>
              <input
                type='checkbox'
                className='styles.taskCheckbox'
                checked={todo.done}
                onChange={onChangeCheckbox(todo.id)}
              />
              <span className={`${styles.taskName} ${todo.done ? styles.taskNameDone : ''}`}>{todo.name}</span>
              <div className={styles.taskActions}>
                <button className={styles.taskBtn} onClick={() => startEditTodo(todo.id)}>
                  ✎
                </button>
                <button className={styles.taskBtn} onClick={() => deleteTodo(todo.id)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

TaskList.propTypes = {
  doneTaskList: PropTypes.bool,
  todos: PropTypes.arrayOf(todoPropTypes),
  changeStatusTodo: PropTypes.func,
  startEdit: PropTypes.func,
  deleteTodo: PropTypes.func
}

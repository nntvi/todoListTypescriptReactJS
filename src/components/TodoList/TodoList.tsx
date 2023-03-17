import React, { useEffect, useState } from 'react'
import { Todo } from '../../@types/todo.type'
import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './todoList.module.scss'

// gom thành func # nhau mỗi callback
interface HandleNewTodos {
  (todos: Todo[]): Todo[] // nhận arr cũ return todo arr mới
}
const syncReactToLocal = (handleNewTodos: HandleNewTodos) => {
  const todosString = localStorage.getItem('todos') // str-json
  const todosObj: Todo[] = JSON.parse(todosString || '[]') // str -> [obj]
  const newTodosObj = handleNewTodos(todosObj)
  localStorage.setItem('todos', JSON.stringify(newTodosObj)) // obj -> str
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const finishTodos = todos.filter((todo) => todo.done)
  const unFinishTodos = todos.filter((todo) => !todo.done)
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)

  useEffect(() => {
    const todosString = localStorage.getItem('todos') // str-json
    const todosObj: Todo[] = JSON.parse(todosString || '[]') // str -> [obj]
    setTodos(todosObj)
  }, [])

  const addTodo = (name: string) => {
    const handler = (todosObj: Todo[]) => {
      return [...todosObj, todo]
    }
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toTimeString()
    }
    setTodos((prev) => [...prev, todo])

    // add localStorage
    syncReactToLocal(handler)
  }

  const changeStatusTodo = (id: string, done: boolean) => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    }
    setTodos(handler)
    syncReactToLocal(handler)
  }

  const startEditTodo = (id: string) => {
    const itemEdit = todos.find((todo) => todo.id === id)
    if (itemEdit) {
      setCurrentTodo(itemEdit)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const saveEditTodo = () => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        if (todo.id === (currentTodo as Todo).id) {
          return currentTodo as Todo
        }
        return todo
      })
    }
    setTodos(handler) // prev => todoObj
    setCurrentTodo(null)

    // save to local
    syncReactToLocal(handler)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handler = (todosObj: Todo[]) => {
      const findIndexToDo = todosObj.findIndex((todo) => todo.id === id)
      if (findIndexToDo > -1) {
        const result = [...todosObj]
        result.splice(findIndexToDo, 1)
        return result
      } else {
        return todosObj
      }
    }
    setTodos(handler)
    syncReactToLocal(handler)
  }
  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} saveEditTodo={saveEditTodo} />
        <TaskList
          todos={unFinishTodos}
          changeStatusTodo={changeStatusTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todos={finishTodos}
          changeStatusTodo={changeStatusTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}

import {
  ListTodosQuery,
  OnCreateTodoSubscription,
  OnDeleteTodoSubscription,
  OnUpdateTodoSubscription,
  TodoStatus
} from '@/API'
import { listTodos } from '@/graphql/queries'
import {
  onCreateTodo,
  onDeleteTodo,
  onUpdateTodo,
} from '@/graphql/subscriptions' // --- ①
import { nonNull } from '@/lib/filter'
import { query, subscription } from '@/lib/graphql'
import { Todo } from '@/models/todo' // --- ②
import { configure } from '@/my-aws-exports'
import { useEffect, useState, useCallback } from 'react'

configure()

export const useTodos = () => { // --- ③
  const [todos, setTodos] = useState<Todo[]>([]) // --- ④

  const addTodo = (todo: Todo) => { // --- ⑤
    setTodos((todos) => [...todos, todo])
  }

  const updateTodo = (todo: Todo) => { // --- ⑤
    setTodos((todos) => {
      const idx = todos.findIndex((item) => item.id === todo.id)
      if (idx !== -1) {
        todos[idx] = todo
      }
      return [...todos]
    })
  }

  const deleteTodo = (todo: Todo) => { // --- ⑤
    setTodos((todos) => {
      const idx = todos.findIndex((item) => item.id === todo.id)
      if (idx !== -1) {
        todos.splice(idx, 1)
      }
      return [...todos]
    })
  }

  useEffect(() => {
    query<ListTodosQuery>(listTodos).then((result) => { // --- ⑥
      if (result.data?.listTodos?.items) {
        setTodos([...todos, ...result.data.listTodos.items.filter(nonNull).map(Todo.fromApi),])
      }
    })
    const onCreate = subscription<OnCreateTodoSubscription>( // --- ⑦
      onCreateTodo
    ).subscribe({
      next: ({
        value: {
          data: { onCreateTodo },
        },
      }) => {
        if (onCreateTodo) {
          addTodo(Todo.fromApi(onCreateTodo))
        }
      },
    })
    const onUpdate = subscription<OnUpdateTodoSubscription>( // --- ⑦
      onUpdateTodo
    ).subscribe({
      next: ({
        value: {
          data: { onUpdateTodo },
        },
      }) => {
        if (onUpdateTodo) {
          updateTodo(Todo.fromApi(onUpdateTodo))
        }
      },
    })
    const onDelete = subscription<OnDeleteTodoSubscription>( // --- ⑦
      onDeleteTodo
    ).subscribe({
      next: ({
        value: {
          data: { onDeleteTodo },
        },
      }) => {
        if (onDeleteTodo) {
          deleteTodo(Todo.fromApi(onDeleteTodo))
        }
      },
    })
    return () => {
      onCreate.unsubscribe() // --- ⑧
      onUpdate.unsubscribe() // --- ⑧
      onDelete.unsubscribe() // --- ⑧
    }
  }, [])

  const todosByStatus = useCallback( // --- ③
    (status: TodoStatus) => {
      const items = [
        ...todos.filter((todo) => todo.status === status),
      ].map((todo) => todo.copy())
      items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      return items
    },
    [todos]
  )

  return {
    todos,
    todosByStatus,
  }
}
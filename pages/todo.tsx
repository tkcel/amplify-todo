import { ListTodosQuery } from '@/API'
import { LoginRequired } from '@/components/auth'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { TodoForm } from '@/components/TodoForm'
import { listTodos } from '@/graphql/queries'
import { query } from '@/lib/graphql'
import { nonNull } from '@/lib/filter'
import { configure } from '@/my-aws-exports'
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import { useEffect, useState } from 'react'
 
type Todo = {
 id: string
 name: string
}
 
configure()
 
const TodoPage = () => {
 const [user, setUser] = useState<object>()
 const [todos, setTodos] = useState<Todo[]>([])
 const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
 
 useEffect(() => {
   return onAuthUIStateChange((_, data) => {
     setUser(data)
   })
 }, [])
 
 useEffect(() => {
  if (todos.length > 0) return
  if (!user) return
  const fetch = async () => {
    const res = await query<ListTodosQuery>(listTodos)
    if (res?.data?.listTodos?.items) {
      const items = res?.data?.listTodos?.items.filter(nonNull)
      setTodos(items)
    }
  }
  fetch()
}, [user])
 
 return (
  <LoginRequired>
  <h1>Todo一覧</h1>
  <ul>
    {todos.map((todo) => (
      <li key={todo.id}>{todo.name}</li>
    ))}
  </ul>
  <Modal
    isOpen={modalIsOpen}
    activator={
      <button onClick={() => setModalIsOpen(true)}>モーダルを開く</button>
    }
    clickOutSide={() => {
      setModalIsOpen(false)
    }}
  >
    <Card>
      <h1>Todoを作成する</h1>
      <TodoForm postSubmit={() => setModalIsOpen(false)} />
    </Card>
  </Modal>
</LoginRequired>
 )
}

export default TodoPage
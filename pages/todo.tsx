import { LoginRequired } from '@/components/auth'
import { Todos } from '@/components/Todo'
import { AmplifyUserContext } from '@/store/user' // --- ①
import { useContext } from 'react'

const TodoPage = () => {
  const user = useContext(AmplifyUserContext) // --- ②

  return <LoginRequired>{user ? <Todos /> : null}</LoginRequired>
}

export default TodoPage
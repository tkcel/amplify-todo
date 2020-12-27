import { LoginRequired } from '@/components/auth'
import { Todos } from '@/components/Todo'
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import { useEffect, useState } from 'react'

const TodoPage = () => {
  const [user, setUser] = useState<object>()

  useEffect(() => {
    return onAuthUIStateChange((_, data) => {
      setUser(data)
    })
  }, [])

  return <LoginRequired>{user ? <Todos /> : null}</LoginRequired>
}

export default TodoPage
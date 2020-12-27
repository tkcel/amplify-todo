import { AmplifyUserContext } from '@/store/user' // --- ①
import { onAuthUIStateChange } from '@aws-amplify/ui-components' // --- ②
import { CognitoUser } from 'amazon-cognito-identity-js' // --- ③
import { AppProps } from 'next/app'
import { FC, useEffect, useState } from 'react'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [user, setUser] = useState<CognitoUser>() // --- ④

  useEffect(() => {
    return onAuthUIStateChange((_, data) => {
      setUser(data as CognitoUser | undefined)
    })
  }, [])

  return (
    <AmplifyUserContext.Provider value={user}> {/* --- ⑤ */}
      <Component {...pageProps} />
    </AmplifyUserContext.Provider>
  )
}

export default MyApp
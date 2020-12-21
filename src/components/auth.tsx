import { configure } from '@/my-aws-exports'
import { AmplifyAuthenticator } from '@aws-amplify/ui-react'
import { FC } from 'react' // --- ①
 
configure()
 
export const LoginRequired: FC = ({ children }) => { // --- ②
 return <AmplifyAuthenticator>{children}</AmplifyAuthenticator> // --- ③
}

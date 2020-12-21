import Amplify from 'aws-amplify'
import AmplifyConfig from './aws-exports'
 
export { AmplifyConfig } // --- ①
 
export const configure = () => { // --- ②
 Amplify.configure(AmplifyConfig)
}

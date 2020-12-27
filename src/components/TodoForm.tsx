import {
  CreateTodoMutation,
  CreateTodoMutationVariables,
  TodoStatus,
 } from '@/API'
 import { createTodo } from '@/graphql/mutations'
 import { mutate } from '@/lib/graphql'
import { useForm } from 'react-hook-form'
import styles from './TodoForm.module.scss'
 
type TodoFormType = {
 id?: string
 name: string
 status: TodoStatus
 owner?: string
}
 
type TodoFormProps = {
 defaultValues?: TodoFormType
 postSubmit?: () => void
}
 
export const TodoForm = ({ defaultValues, postSubmit }: TodoFormProps) => {
 const { handleSubmit, register, reset } = useForm<TodoFormType>({
   defaultValues: {
     ...defaultValues,
     status: TodoStatus.NONE,
   },
 })
 
 const onSubmit = async ({ name, status, id }: TodoFormType) => {
  if (!id) {
    await mutate<CreateTodoMutation, CreateTodoMutationVariables>(
      createTodo,
      {
        input: {
          name,
          status,
        },
      }
    )
  }
  reset()
  if (postSubmit) {
    postSubmit()
  }
}
 
 return (
   <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
     <div className={styles['field']}>
       <label className={styles['field-label']} htmlFor="name_input">
         名前
       </label>
       <input
         className={styles['field-input']}
         id="name_input"
         name="name"
         ref={register({ required: true })}
       />
     </div>
     <div className={styles['field']}>
       <label className={styles['field-label']} htmlFor="status_input">
         ステータス
       </label>
       <select
         className={styles['field-select']}
         id="status_input"
         name="status"
         ref={register({ required: true })}
       >
         <option className={styles['field-select-option']} value="NONE">
           なし
         </option>
         <option className={styles['field-select-option']} value="BACKLOG">
           バックログ
         </option>
         <option className={styles['field-select-option']} value="DOING">
           作業中
         </option>
         <option className={styles['field-select-option']} value="REVIEW">
           レビュー中
         </option>
         <option className={styles['field-select-option']} value="DONE">
           完了
         </option>
       </select>
     </div>
     <div className={styles['button-field']}>
       <button className={styles['button']} type="submit">
         保存
       </button>
     </div>
   </form>
 )
}
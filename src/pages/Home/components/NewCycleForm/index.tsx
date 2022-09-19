import { FormContainer, MinutesAmountInput, TaskInput } from './styles'

import { CyclesContexts } from '../../../../contexts/CyclesContext'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContexts)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Dê um nome para o seu projeto</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Dê um nome para seu projeto"
        disabled={!!activeCycle}
        {...register('task')}
      />
      <datalist id="taskSuggestions">
        <option value="Projeto 1" />
      </datalist>

      <label htmlFor="minutesAmount">Durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos</span>
    </FormContainer>
  )
}

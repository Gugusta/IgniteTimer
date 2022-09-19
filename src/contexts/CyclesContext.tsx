import React, { createContext, useState, useReducer } from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextTYpe {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  markCurrtentCycleAsFinished: () => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

interface CycleContextsProviderProps {
  children: React.ReactNode | React.ReactNode[]
}
export const CyclesContexts = createContext({} as CyclesContextTYpe)

export function CyclesContextProvider({
  children,
}: CycleContextsProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrtentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDateTime: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())

    setAmountSecondsPassed(0)
  }

  return (
    <CyclesContexts.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrtentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContexts.Provider>
  )
}

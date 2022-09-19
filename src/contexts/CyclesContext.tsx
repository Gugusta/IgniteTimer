import React, { createContext, useState, useReducer } from 'react'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDateTime: Date
  interruptedDate?: Date
  finishedDate?: Date
}

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
  const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
    if (action.type === 'ADD_NEW_CYCLE') {
      return [...state, action.payload.newCycle]
    }

    return state
  }, [])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrtentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: { activeCycleId },
    })
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDateTime: new Date(),
    }

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: { newCycle },
    })
    setActiveCycleId(id)
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: { activeCycleId },
    })

    setActiveCycleId(null)
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

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

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesContextProvider({
  children,
}: CycleContextsProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
        case 'INTERRUPT_CURRENT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return {
                  ...cycle,
                  interruptedDate: new Date(),
                }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return {
                  ...cycle,
                  finishedDate: new Date(),
                }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        default:
          return state
      }
    },
    { cycles: [], activeCycleId: null },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const { cycles, activeCycleId } = cyclesState
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
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: { activeCycleId },
    })

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

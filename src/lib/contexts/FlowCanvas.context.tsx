import { atom, deepMap, type DeepMapStore, type WritableAtom } from 'nanostores'
import { createContext, type PropsWithChildren } from 'react'
import type { FlowLikesDTO } from '../db/dto/reactflow.dto'

type FlowContextStore = {
  $isEditing: WritableAtom<boolean>
  $flowLikes: DeepMapStore<FlowLikesDTO>
}

export const FlowCanvasContext = createContext<FlowContextStore>({} as FlowContextStore)

export type FlowCanvasProviderProps = {
  flowLikes?: FlowLikesDTO
}

export const FlowCanvasProvider = ({
  children,
  flowLikes,
}: PropsWithChildren<FlowCanvasProviderProps>) => {
  const $isEditing = atom(false)
  const $flowLikes = deepMap<FlowLikesDTO>(flowLikes)

  return (
    <FlowCanvasContext.Provider
      value={{
        $isEditing,
        $flowLikes,
      }}
    >
      {children}
    </FlowCanvasContext.Provider>
  )
}

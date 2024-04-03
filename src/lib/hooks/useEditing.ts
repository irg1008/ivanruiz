import { useStore } from '@nanostores/react'
import { useContext } from 'react'
import { FlowCanvasContext } from '../contexts/FlowCanvas.context'

export const useIsEditing = () => {
  const { $isEditing } = useContext(FlowCanvasContext)
  const isEditing = useStore($isEditing)

  const toggleEditing = () => {
    $isEditing.set(!isEditing)
  }

  return {
    isEditing,
    toggleEditing,
  }
}

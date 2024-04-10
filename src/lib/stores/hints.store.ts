import { persistentAtom } from '@nanostores/persistent'

const $hintsDismissed = persistentAtom('hints')

export const saveHintsDismissed = () => {
  $hintsDismissed.set('🫡') // LOL
}

export const areHintsDismissed = () => {
  return Boolean($hintsDismissed.get())
}

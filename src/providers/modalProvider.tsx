export const openModalHandler = (set, setSteps) => {
  setSteps('loading')
  set(true)
}
export const closeModalHandler = (set, setSteps) => {
  setSteps('loading')
  set(false)
}

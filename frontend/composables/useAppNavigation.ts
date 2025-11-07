export function useAppNavigation() {
  const localePath = useLocalePath()

  const navigateTo = (path: string) => {
    navigateTo(localePath(path))
  }

  return {
    navigateTo,
  }
}

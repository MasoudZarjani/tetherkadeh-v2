export function useNotifications() {
  const notifications = ref([
    {
      id: 1,
      message: 'به صرافی تترکده خوش آمدید.',
      type: 'info',
    },
    {
      id: 2,
      message: 'اولین برداشت بعد از 72 ساعت انجام خواهد شد.',
      type: 'warning',
    },
    {
      id: 3,
      message: 'برداشت های بعدی با توجه به شرایط حساب بین 1 تا 72 ساعت انجام خواهد شد.',
      type: 'warning',
    },
  ])

  return { notifications }
}

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  loading: boolean
}>()
const emit = defineEmits(['update:modelValue', 'confirm'])

const oldPassword = ref('')
const password = ref('')
const confirmPassword = ref('')
const oldPasswordError: Ref<string | null> = ref('')
const passwordError: Ref<string | null> = ref('')
const confirmPasswordError: Ref<string | null> = ref('')

function closeModal() {
  emit('update:modelValue', false)
}

watch(
  () => password,
  newVal => {
    passwordError.value = useValidate(newVal.value, 'password')
  },
  { deep: true }
)

watch(
  () => oldPassword,
  newVal => {
    oldPasswordError.value = useValidate(newVal.value, 'password')
  },
  { deep: true }
)

watch(
  () => confirmPassword,
  newVal => {
    confirmPasswordError.value = newVal.value !== password.value ? 'passwordNotMatch' : null
  },
  { deep: true }
)

const validateForm = () => {
  passwordError.value = useValidate(password.value, 'password')
  oldPasswordError.value = useValidate(oldPassword.value, 'password')
  confirmPasswordError.value = confirmPassword.value !== password.value ? 'passwordNotMatch' : null
  if (!confirmPasswordError.value && !passwordError.value && !oldPasswordError.value) {
    emit('confirm', password.value, oldPassword.value)
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-slate-100 dark:bg-slate-800 rounded-xl w-full max-w-md shadow-lg">
        <div class="text-xl w-full border-b border-gray-200 dark:border-gray-700">
          <div class="p-2 md:p-4 w-full flex justify-between items-center">
            {{ $t('changePassword') }}
            <BaseIcon name="close" @click="closeModal()" className="w-5" />
          </div>
        </div>
        <div class="w-full p-2 md:p-4">
          <form @submit.prevent="validateForm()" class="mt-8">
            <div class="mt-2">
              <CoreInputPassword
                label="oldPassword"
                v-model="oldPassword"
                :error="oldPasswordError"
              />
              <CoreInputPassword
                label="newPassword"
                v-model="password"
                :error="passwordError"
                class="mt-8"
              />
              <CoreInputConfirmPassword
                class="mt-2"
                v-model="confirmPassword"
                :error="confirmPasswordError"
              />
            </div>
            <div class="mt-4">
              <CoreBtnDefault :is-loading="loading" class="w-full mt-6">
                {{ $t('confirm') }}
              </CoreBtnDefault>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

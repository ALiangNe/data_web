import { ref } from 'vue'

export type AlertType = 'info' | 'error'

const visible = ref(false)
const message = ref('')
const type = ref<AlertType>('info')

export const useAlert = () => {
    const show = (text: string, alertType: AlertType = 'info') => {
        message.value = text
        type.value = alertType
        visible.value = true
    }

    const close = () => {
        visible.value = false
        message.value = ''
        type.value = 'info'
    }

    return {
        visible,
        message,
        type,
        show,
        close,
    }
}

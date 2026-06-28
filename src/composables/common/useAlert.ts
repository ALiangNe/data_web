import { ElMessage } from 'element-plus'

export type AlertType = 'info' | 'error' | 'success'

export const useAlert = () => {
    const show = (text: string, alertType: AlertType = 'info') => {
        const options = { message: text, showClose: true }

        if (alertType === 'error') {
            ElMessage.error(options)
            return
        }
        if (alertType === 'success') {
            ElMessage.success(options)
            return
        }
        ElMessage.info(options)
    }

    return { show }
}

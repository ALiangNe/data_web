<template>
    <div class="data-list-view">
        <section class="software-form">
            <ElForm class="software-form__form" label-position="top" @submit.prevent="submit">
                <div class="software-form__grid">
                    <ElFormItem label="type" class="software-form__item">
                        <ElSelect v-model="formValues.type" placeholder="type"
                            :disabled="submitting || checksumLoading">
                            <ElOption label="document" value="document" />
                            <ElOption label="image" value="image" />
                            <ElOption label="firmware" value="firmware" />
                            <ElOption label="software" value="software" />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="name" class="software-form__item">
                        <ElInput v-model="formValues.name" placeholder="name"
                            :disabled="submitting || checksumLoading" />
                    </ElFormItem>

                    <ElFormItem label="version" class="software-form__item">
                        <ElInput v-model="formValues.version" placeholder="version"
                            :disabled="submitting || checksumLoading" />
                    </ElFormItem>

                    <ElFormItem label="dependencies" class="software-form__item software-form__item--wide">
                        <ElInput v-model="formValues.dependencies" placeholder="{}"
                            :disabled="submitting || checksumLoading" :rows="4" type="textarea" />
                    </ElFormItem>

                    <ElFormItem label="changelog" class="software-form__item software-form__item--wide">
                        <ElInput v-model="formValues.changelog" placeholder="changelog"
                            :disabled="submitting || checksumLoading" :rows="5" type="textarea" />
                    </ElFormItem>
                </div>

                <ElFormItem label="File" class="software-form__upload-item">
                    <ElUpload class="software-form__upload" drag :auto-upload="false" :show-file-list="false"
                        :disabled="submitting || checksumLoading" :on-change="onFileChange">
                        <div class="software-form__upload-content">
                            <p class="software-form__upload-title">Drop file here or click to upload</p>
                            <p class="software-form__upload-text">The file will be uploaded after the form is submitted.
                            </p>
                        </div>
                    </ElUpload>
                    <div v-if="fileInfo" class="software-form__file-info">
                        <p class="software-form__file-line">Size Bytes: {{ fileInfo.sizeBytes }}</p>
                        <p class="software-form__file-line">
                            Checksum: {{ fileInfo.checksumLoading ? 'Calculating...' : fileInfo.checksum }}
                        </p>
                    </div>
                </ElFormItem>

                <div class="software-form__actions">
                    <ElButton type="primary" native-type="submit" :loading="submitting || checksumLoading">
                        Submit
                    </ElButton>
                </div>
            </ElForm>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { createSoftware } from '@/api/data'
import { useAlert } from '@/composables'
import { ApiError } from '@/types/api'
import { ElButton, ElForm, ElFormItem, ElInput, ElOption, ElSelect, ElUpload } from 'element-plus'
import type { UploadFile } from 'element-plus'
import type { SoftwareUploadResult } from '@/types/data'

const { show } = useAlert()

const formValues = ref<Record<string, string>>({
    type: '',
    name: '',
    version: '',
    dependencies: '',
    changelog: '',
})
const file = ref<File | null>(null)
const fileChecksum = ref('')
const checksumLoading = ref(false)
const submitting = ref(false)

const fileInfo = computed(() => {
    if (!file.value) return null
    return {
        sizeBytes: file.value.size,
        checksum: fileChecksum.value,
        checksumLoading: checksumLoading.value,
    }
})

const toSha256 = async (target: File) => {
    const buffer = await target.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('')
}

const onFileChange = (uploadFile: UploadFile) => {
    const value = uploadFile.raw ?? null
    file.value = value
    fileChecksum.value = ''
    if (!value) return

    checksumLoading.value = true
    toSha256(value)
        .then((checksum) => {
            fileChecksum.value = checksum
        })
        .catch((error) => {
            console.error(error)
            file.value = null
            show('Failed to calculate file checksum.', 'error')
        })
        .finally(() => {
            checksumLoading.value = false
        })
}

const uploadFile = async (uploadUrl: SoftwareUploadResult) => {
    console.log('uploadUrl', uploadUrl)
}

const resetForm = () => {
    formValues.value = {
        type: '',
        name: '',
        version: '',
        dependencies: '',
        changelog: '',
    }
    file.value = null
    fileChecksum.value = ''
}

const submit = async () => {
    const type = formValues.value.type.trim()
    const name = formValues.value.name.trim()
    const version = formValues.value.version.trim()
    const dependencies = formValues.value.dependencies.trim()
    const changelog = formValues.value.changelog.trim()

    if (!type || !name || !version || !file.value || !fileChecksum.value || checksumLoading.value) {
        show('Please complete the form and wait for checksum calculation.', 'error')
        return
    }

    const params = {
        type,
        name,
        version,
        dependencies,
        changelog,
        file_size_bytes: file.value.size,
        file_checksum: fileChecksum.value,
    }

    submitting.value = true

    let upload: SoftwareUploadResult
    try {
        upload = await createSoftware(params)
    } catch (error) {
        console.error('SoftwareView createSoftware failed:', error)
        const message = error instanceof ApiError && error.message
            ? error.message
            : 'Failed to create software. Please try again.'
        show(message, 'error')
        submitting.value = false
        return
    }

    try {
        await uploadFile(upload)
    } catch (error) {
        console.error('SoftwareView upload file failed:', error)
        show('Failed to upload file. Please try again.', 'error')
        submitting.value = false
        return
    }

    submitting.value = false
    resetForm()
    show('Software uploaded successfully.', 'success')
}
</script>

<style scoped lang="scss">
.software-form {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.software-form__form {
    padding: 1rem 1.25rem;
}

.software-form__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem 1rem;
}

.software-form__item {
    margin-bottom: 0;

    :deep(.el-select),
    :deep(.el-input),
    :deep(.el-textarea) {
        width: 100%;
    }
}

.software-form__item--wide {
    grid-column: span 3;
}

.software-form__upload-item {
    margin-top: 1rem;
    margin-bottom: 0;

    :deep(.el-upload) {
        width: 100%;
    }

    :deep(.el-upload-dragger) {
        width: 100%;
        padding: 1.25rem;
        border-radius: var(--radius);
    }
}

.software-form__upload-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.software-form__upload-title,
.software-form__upload-text,
.software-form__file-line {
    margin: 0;
    line-height: 1.5;
}

.software-form__upload-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
}

.software-form__upload-text {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
}

.software-form__file-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-hover);
}

.software-form__file-line {
    font-size: 0.8125rem;
    color: var(--color-text);
    word-break: break-word;
}

.software-form__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}
</style>

<template>
    <section class="software-form">
        <ElForm class="software-form__form" label-position="top" @submit.prevent="handleSubmit">
            <div class="software-form__grid">
                <ElFormItem label="type" class="software-form__item">
                    <ElSelect v-model="form.type" placeholder="type" :disabled="locked">
                        <ElOption
                            v-for="type in softwareTypes"
                            :key="type"
                            :label="type"
                            :value="type"
                        />
                    </ElSelect>
                </ElFormItem>

                <ElFormItem label="name" class="software-form__item">
                    <ElInput
                        v-model="form.name"
                        placeholder="name"
                        :disabled="locked"
                        @blur="requestVersionOptions"
                        @keydown.enter.prevent="requestVersionOptions"
                    />
                </ElFormItem>

                <ElFormItem label="version" class="software-form__item">
                    <ElSelect
                        v-if="!allowCustomVersion"
                        v-model="form.version"
                        placeholder="version"
                        no-data-text="No Data"
                        :disabled="locked || !form.name.trim()"
                        :loading="loadingVersion"
                    >
                        <ElOption
                            v-for="version in versionOptions"
                            :key="version"
                            :label="version"
                            :value="version"
                        />
                    </ElSelect>
                    <ElInput
                        v-else
                        v-model="form.version"
                        placeholder="version"
                        :disabled="locked || !form.name.trim()"
                    />
                </ElFormItem>

                <ElFormItem label="dependencies" class="software-form__item software-form__item--wide">
                    <div class="software-form__dependencies">
                        <div v-for="group in dependencyGroups" :key="group.key" class="software-form__dependency-group">
                            <div v-for="(condition, index) in group.conditions" :key="condition.key" class="software-form__dependency-row">
                                <ElSelect
                                    v-if="index === 0"
                                    v-model="group.name"
                                    class="software-form__dependency-package"
                                    placeholder="package"
                                    no-data-text="No Data"
                                    clearable
                                    :disabled="locked"
                                    @change="onDependencyNameChange(group)"
                                    @end-reached="onPackageEndReached"
                                >
                                    <ElOption
                                        v-for="pkg in dependencyPackages"
                                        :key="pkg.name"
                                        :label="pkg.name"
                                        :value="pkg.name"
                                    />
                                </ElSelect>
                                <div v-else class="software-form__dependency-joiner-cell">
                                    <ElSelect
                                        v-model="condition.joiner"
                                        class="software-form__dependency-joiner"
                                        :disabled="locked"
                                    >
                                        <ElOption label="and" value="and" />
                                        <ElOption label="or" value="or" />
                                    </ElSelect>
                                </div>
                                <ElSelect
                                    v-model="condition.operator"
                                    class="software-form__dependency-operator"
                                    placeholder="operator"
                                    clearable
                                    :disabled="locked || !group.name"
                                    @change="condition.version = ''"
                                >
                                    <ElOption
                                        v-for="operator in dependencyOperators"
                                        :key="operator"
                                        :label="operator"
                                        :value="operator"
                                    />
                                </ElSelect>
                                <ElSelect
                                    v-model="condition.version"
                                    class="software-form__dependency-version"
                                    placeholder="version"
                                    no-data-text="No Data"
                                    clearable
                                    :disabled="locked || !group.name || !condition.operator"
                                >
                                    <ElOption
                                        v-for="version in getDependencyVersionOptions(group, condition.operator)"
                                        :key="version"
                                        :label="version"
                                        :value="version"
                                    />
                                </ElSelect>
                                <button
                                    type="button"
                                    class="software-form__dependency-button software-form__dependency-action"
                                    :disabled="locked"
                                    @click="removeDependencyCondition(group, index)"
                                >
                                    -
                                </button>
                            </div>
                            <div class="software-form__dependency-row">
                                <div></div>
                                <button
                                    type="button"
                                    class="software-form__dependency-button software-form__dependency-add"
                                    :disabled="locked"
                                    @click="addDependencyCondition(group)"
                                >
                                    Add condition
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="software-form__dependency-button software-form__dependency-add"
                            :disabled="locked"
                            @click="addDependencyGroup"
                        >
                            Add dependency
                        </button>
                    </div>
                </ElFormItem>

                <ElFormItem label="changelog" class="software-form__item software-form__item--wide">
                    <ElInput
                        v-model="form.changelog"
                        type="textarea"
                        :rows="5"
                        resize="none"
                        placeholder="changelog"
                        :disabled="locked"
                    />
                </ElFormItem>
            </div>

            <ElFormItem label="file" class="software-form__upload-item">
                <ElUpload
                    ref="uploadRef"
                    class="software-form__upload"
                    drag
                    :auto-upload="false"
                    :limit="1"
                    :disabled="locked"
                    :on-change="onFileChange"
                    :on-remove="onFileRemove"
                    :on-exceed="onFileExceed"
                >
                    <ElIcon class="el-icon--upload">
                        <UploadFilled />
                    </ElIcon>
                    <div class="el-upload__text">
                        Drop file here or <em>click to upload</em>
                    </div>
                    <template v-if="file" #tip>
                        <div class="el-upload__tip">
                            File size: {{ formatBytes(file.size) }}
                        </div>
                    </template>
                </ElUpload>
            </ElFormItem>

            <div class="software-form__actions">
                <ElButton type="primary" native-type="submit" :loading="locked">
                    Submit
                </ElButton>
            </div>
        </ElForm>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElButton, ElForm, ElFormItem, ElIcon, ElInput, ElOption, ElSelect, ElUpload, genFileId } from 'element-plus'
import type { UploadFile, UploadInstance, UploadRawFile } from 'element-plus'
import { useAlert } from '@/composables'
import { formatBytes } from '@/utils/format'
import semver from 'semver'
import type { SoftwareUploadPostParams } from '@/types/data'

type DependencyPackage = {
    name: string
    versionOptions: string[]
    publishedVersions: string[]
}

type DependencyCondition = {
    key: number
    joiner: '' | 'and' | 'or'
    operator: string
    version: string
}

type DependencyGroup = {
    key: number
    name: string
    versionOptions: string[]
    publishedVersions: string[]
    conditions: DependencyCondition[]
}

const props = defineProps<{
    disabled?: boolean
    loadingVersion?: boolean
    allowCustomVersion?: boolean
    versionOptions: string[]
    dependencyPackages: DependencyPackage[]
}>()

const emit = defineEmits<{
    'submit': [params: SoftwareUploadPostParams, file: File]
    'request-version': [name: string]
    'request-dependency-versions': [name: string]
    'load-more-packages': []
}>()

const { show } = useAlert()

const softwareTypes = ['document', 'image', 'firmware', 'software']
const dependencyOperators = ['=', '>', '<', '>=', '<=', '^', '~']
const publishedVersionOperators = ['>', '>=', '^', '~']
const lowerBoundOperators = ['=', '>', '>=', '^', '~']
const upperBoundOperators = ['=', '<', '<=', '^', '~']

const form = ref({
    type: '',
    name: '',
    version: '',
    changelog: '',
})
const file = ref<File | null>(null)
const fileChecksum = ref('')
const checksumLoading = ref(false)
const dependencyGroups = ref<DependencyGroup[]>([])
const uploadRef = ref<UploadInstance>()

let groupKey = 0
let conditionKey = 0

const locked = computed(() => !!props.disabled || checksumLoading.value)

const emptyCondition = (joiner: DependencyCondition['joiner'] = ''): DependencyCondition => {
    conditionKey += 1
    return { key: conditionKey, joiner, operator: '', version: '' }
}

const getDependencyVersionOptions = (group: DependencyGroup, operator: string) => {
    return publishedVersionOperators.includes(operator)
        ? group.publishedVersions
        : group.versionOptions
}

const onFileChange = async (uploadFile: UploadFile) => {
    const value = uploadFile.raw ?? null
    file.value = value
    fileChecksum.value = ''
    if (!value) return

    checksumLoading.value = true
    try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', await value.arrayBuffer())
        fileChecksum.value = Array.from(new Uint8Array(hashBuffer))
            .map((item) => item.toString(16).padStart(2, '0'))
            .join('')
    } catch (error) {
        console.error(error)
        file.value = null
        uploadRef.value?.clearFiles()
        show('Failed to calculate file checksum.', 'error')
    } finally {
        checksumLoading.value = false
    }
}

const onFileRemove = () => {
    file.value = null
    fileChecksum.value = ''
}

const onFileExceed = (files: File[]) => {
    const upload = uploadRef.value
    const next = files[0]
    if (!upload || !next) return

    upload.clearFiles()
    const raw = next as UploadRawFile
    raw.uid = genFileId()
    upload.handleStart(raw)
}

const requestVersionOptions = () => {
    form.value.version = ''
    emit('request-version', form.value.name.trim())
}

const onPackageEndReached = (direction: 'top' | 'bottom' | 'left' | 'right') => {
    if (direction !== 'bottom') return
    emit('load-more-packages')
}

const onDependencyNameChange = (group: DependencyGroup) => {
    const pkg = props.dependencyPackages.find((item) => item.name === group.name)
    if (!pkg) {
        group.versionOptions = []
        group.publishedVersions = []
        group.conditions = [emptyCondition()]
        return
    }

    group.versionOptions = [...pkg.versionOptions]
    group.publishedVersions = [...pkg.publishedVersions]
    for (const condition of group.conditions) {
        condition.version = ''
    }
    emit('request-dependency-versions', group.name)
}

const addDependencyGroup = () => {
    groupKey += 1
    dependencyGroups.value.push({
        key: groupKey,
        name: '',
        versionOptions: [],
        publishedVersions: [],
        conditions: [emptyCondition()],
    })
}

const addDependencyCondition = (group: DependencyGroup) => {
    group.conditions.push(emptyCondition('and'))
}

const removeDependencyCondition = (group: DependencyGroup, index: number) => {
    if (group.conditions.length > 1) {
        group.conditions.splice(index, 1)
        group.conditions[0].joiner = ''
        return
    }
    dependencyGroups.value = dependencyGroups.value.filter((item) => item !== group)
}

const handleSubmit = () => {
    if (props.disabled) return

    const type = form.value.type.trim()
    const name = form.value.name.trim()
    const version = form.value.version.trim()
    const changelog = form.value.changelog.trim()

    if (!type || !name || !version || !changelog || !file.value || !fileChecksum.value || checksumLoading.value) {
        show('Please complete the form and wait for checksum calculation.', 'error')
        return
    }

    for (const group of dependencyGroups.value) {
        const dependencyName = group.name.trim()
        const hasPartialCondition = group.conditions.some((item) =>
            (item.operator && !item.version) || (!item.operator && item.version))
        const completeConditions = group.conditions.filter((item) => item.operator && item.version)
        const hasAnyInput = dependencyName || group.conditions.some((item) => item.operator || item.version)

        if (!hasAnyInput) continue

        if (!dependencyName) {
            show('Please select dependency package.', 'error')
            return
        }
        if (hasPartialCondition) {
            show('Please complete dependency operator and version.', 'error')
            return
        }
        if (!completeConditions.length) {
            show('Please complete dependency conditions.', 'error')
            return
        }
    }

    const dependencyItems = dependencyGroups.value
        .map((group) => {
            const conditions = group.conditions.filter((item) => item.operator && item.version)
            const maxVersion = semver.valid(group.versionOptions[0] ?? '')
            const rangeParts: {
                comparators: string[]
                hasLower: boolean
                hasUpper: boolean
                hasInvalid: boolean
            }[] = []

            for (const condition of conditions) {
                const currentRange = rangeParts[rangeParts.length - 1]
                const value = semver.valid(condition.version)
                const rangeItem = {
                    comparators: [value ? `${condition.operator}${value}` : ''],
                    hasLower: lowerBoundOperators.includes(condition.operator),
                    hasUpper: upperBoundOperators.includes(condition.operator),
                    hasInvalid: !value,
                }

                if (!currentRange || condition.joiner === 'or') {
                    rangeParts.push(rangeItem)
                    continue
                }

                currentRange.comparators.push(rangeItem.comparators[0])
                currentRange.hasLower = currentRange.hasLower || rangeItem.hasLower
                currentRange.hasUpper = currentRange.hasUpper || rangeItem.hasUpper
                currentRange.hasInvalid = currentRange.hasInvalid || rangeItem.hasInvalid
            }

            const ranges = rangeParts.map((item) => {
                if (item.hasInvalid) return ''
                if (!item.hasUpper && !maxVersion) return ''

                const comparators = [...item.comparators]
                if (!item.hasLower) comparators.unshift('>=0.0.0')
                if (!item.hasUpper) comparators.push(`<${maxVersion}`)
                return comparators.join(' ')
            })
            const uniqueRanges = [...new Set(ranges)]
            const hasInvalidRange = uniqueRanges.some((item) =>
                !item || !semver.validRange(item) || !semver.minVersion(item))
            const range = hasInvalidRange
                ? ''
                : uniqueRanges
                    .filter((item, index) => !uniqueRanges.some((target, targetIndex) =>
                        targetIndex !== index && semver.subset(item, target)))
                    .join(' || ')

            return {
                name: group.name.trim(),
                conditions,
                range,
            }
        })
        .filter((item) => item.name && item.conditions.length)

    if (dependencyItems.some((item) => !item.range)) {
        show('Please enter a valid dependency version range.', 'error')
        return
    }

    const dependencyNames = dependencyItems.map((item) => item.name)
    if (new Set(dependencyNames).size !== dependencyNames.length) {
        show('Duplicate dependency package.', 'error')
        return
    }

    emit('submit', {
        type,
        name,
        version,
        dependencies: Object.fromEntries(dependencyItems.map((item) => [item.name, item.range])),
        changelog,
        fileName: file.value.name,
        mimeType: file.value.type || 'application/octet-stream',
        sizeBytes: file.value.size,
        checksum: fileChecksum.value,
    }, file.value)
}

watch(
    () => [props.versionOptions, props.allowCustomVersion] as const,
    ([options, allowCustomVersion]) => {
        if (allowCustomVersion) {
            form.value.version = 'v1.0.0'
            return
        }
        form.value.version = options.length ? options[options.length - 1] : ''
    },
)

watch(
    () => props.dependencyPackages,
    () => {
        for (const group of dependencyGroups.value) {
            const pkg = props.dependencyPackages.find((item) => item.name === group.name)
            group.versionOptions = pkg?.versionOptions ?? []
            group.publishedVersions = pkg?.publishedVersions ?? []
        }
    },
    { deep: true },
)
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

.software-form__dependencies {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
}

.software-form__dependency-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.software-form__dependency-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr)) 2.5rem;
    gap: 0.75rem;
    align-items: center;

    >.software-form__dependency-add {
        grid-column: 2 / -1;
    }
}

.software-form__dependency-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font: inherit;
    line-height: 1;
    color: var(--color-text);
    cursor: pointer;

    &:hover:not(:disabled) {
        background: var(--color-hover);
    }

}

.software-form__dependency-action {
    min-width: 2.5rem;
    height: 1.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
}

.software-form__dependency-joiner-cell {
    display: flex;
    justify-content: flex-end;
    min-width: 0;
}

.software-form__dependency-joiner {
    width: 5rem;
}

:deep(.software-form__dependency-joiner.el-select) {
    width: 5rem;
}

.software-form__dependency-add {
    width: 100%;
    height: 2rem;
    font-weight: 600;
    color: var(--color-text-secondary);
}

.software-form__upload-item {
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 0;

    :deep(.el-form-item__content) {
        display: block;
        width: 100%;
    }

    :deep(.el-upload) {
        display: block;
        width: 100%;
    }

    :deep(.el-upload-dragger) {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        border-radius: var(--radius);
    }
}

.software-form__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .software-form__dependency-row {
        grid-template-columns: 1fr;
    }
}
</style>

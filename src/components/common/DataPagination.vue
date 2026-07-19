<template>
    <section class="data-pagination">
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="pageSizeOptions"
            :total="total"
            :disabled="loading"
            :pager-count="5"
            layout="total, sizes, prev, pager, next"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
        />
    </section>
</template>

<script setup lang="ts">
import { ElPagination } from 'element-plus'

const props = defineProps<{
    page: number
    pageSize: number
    total: number
    loading: boolean
    pageSizeOptions: number[]
}>()

const emit = defineEmits<{
    (e: 'update:page', value: number): void
    (e: 'update:pageSize', value: number): void
}>()

const onCurrentChange = (value: number) => {
    if (value !== props.page) {
        emit('update:page', value)
    }
}

const onSizeChange = (value: number) => {
    emit('update:pageSize', value)
}
</script>

<style scoped lang="scss">
.data-pagination {
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0.75rem 1.25rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}
</style>

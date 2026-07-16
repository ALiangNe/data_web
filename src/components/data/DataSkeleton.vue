<template>
    <section
        class="data-skeleton"
        :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
    >
        <ElSkeleton
            v-for="item in rows * columns"
            :key="item"
            animated
            class="data-skeleton__item"
            :style="{ minHeight: height }"
        >
            <template #template>
                <ElSkeletonItem variant="text" class="data-skeleton__title" />
                <ElSkeletonItem variant="rect" class="data-skeleton__body" />
            </template>
        </ElSkeleton>
    </section>
</template>

<script setup lang="ts">
import { ElSkeleton, ElSkeletonItem } from 'element-plus'

defineProps<{
    rows: number
    columns: number
    height: string
}>()
</script>

<style scoped lang="scss">
.data-skeleton {
    display: grid;
    gap: 1rem;
}

.data-skeleton__item {
    box-sizing: border-box;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
}

.data-skeleton__title {
    width: 40%;
}

.data-skeleton__body {
    width: 100%;
    height: calc(100% - 2.5rem);
    min-height: 3rem;
    margin-top: 1rem;
}
</style>

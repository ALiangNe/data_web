import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataRegion } from '@/types/data'

export const useRegionStore = defineStore('regionStore', () => {
    const region = ref<DataRegion>('usw1')

    const setRegion = (value: DataRegion) => {
        region.value = value
    }

    return {
        region,
        setRegion,
    }
})

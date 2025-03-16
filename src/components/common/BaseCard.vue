<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'normal', // none, small, normal, large
    validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
  },
  shadow: {
    type: String,
    default: 'md', // none, sm, md, lg, xl
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  border: {
    type: Boolean,
    default: true
  },
  rounded: {
    type: String,
    default: 'md', // none, sm, md, lg, xl, full
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  }
})

const paddingClasses = {
  none: 'p-0',
  small: 'p-2',
  normal: 'p-4',
  large: 'p-6'
}

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
}

const cardClasses = computed(() => {
  return [
    paddingClasses[props.padding],
    shadowClasses[props.shadow],
    roundedClasses[props.rounded],
    props.border ? 'border border-gray-200' : '',
    'bg-white'
  ].join(' ')
})
</script>

<template>
  <div :class="cardClasses">
    <div v-if="title || subtitle" class="mb-4">
      <h3 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
    </div>
    <slot></slot>
  </div>
</template>

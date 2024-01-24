<template>
    <Primitive :class="styles({ sticky, class: props.class })" v-bind="reactiveOmit(props, 'class')">
      <slot> </slot>
    </Primitive>
  </template>
  
  <script lang="ts" setup>
    import { Primitive } from "radix-vue";
    import type { PrimitiveProps } from "radix-vue";
  
    const props = withDefaults(
      defineProps<
        PrimitiveProps & {
          class?: any;
          sticky?: boolean;
        }
      >(),
      {
        as: "header",
      }
    );
  
    const styles = tv({
      base: "z-20 h-14 border border-slate-500 shadow-lg bg-background/90 backdrop-blur",
      variants: {
        sticky: {
          true: "sticky bottom-3",
        },
      },
    });
  </script>
  
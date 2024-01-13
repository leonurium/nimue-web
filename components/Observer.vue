<template>
    <div class="observer" />
</template>

<script>
export default {
    props: {
        options: {
            type: Object
        }
    },
    data: () => ({
        observer: null,
    }),
    mounted() {
        const observerOptions = this.options || {};
        this.observer = new IntersectionObserver(([entry]) => {
            if (entry && entry.isIntersecting) {
                this.$emit("intersect");
            }
        }, observerOptions);

        this.observer.observe(this.$el);
    },
    destroyed() {
        this.observer.disconnect();
    },
};
</script>
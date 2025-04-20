<script setup lang="ts">
import TopNav from '@/components/navigation/TopNav.vue';
import BottomNav from '@/components/navigation/BottomNav.vue';

</script>
<template>
	<TopNav />
	<main>
		<slot></slot>
	</main>
	<BottomNav />
</template>
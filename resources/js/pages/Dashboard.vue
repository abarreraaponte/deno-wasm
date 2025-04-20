<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import OrgLayout from '@/layouts/OrgLayout.vue';
</script>

<template>
	<Head title="Dashboard" />
	<OrgLayout>
		<div class="flex flex-col items-center justify-center h-screen">
			<h1 class="text-4xl font-bold">Dashboard</h1>
			<p class="mt-4 text-lg">Welcome to the dashboard!</p>
		</div>
	</OrgLayout>
</template>
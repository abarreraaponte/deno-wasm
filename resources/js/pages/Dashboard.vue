<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import OrgLayout from '@/layouts/OrgLayout.vue';
import { User, Organization, Flash, Environment, PageBreadcrumb } from '@/types';
import { t__ } from '@/utils/locale';

const breadcrumbs: PageBreadcrumb[] = [
	{
		name: t__('Dashboard'),
		href: '/dashboard',
	},
	{
		name: t__('Home'),
		href: '/',
	},
	{
		name: t__('Settings'),
		href: '/settings',
	},
	{
		name: t__('Profile'),
		href: '/profile',
	},
];

defineProps<{
	user: User,
	organization: Organization,
	flash: Flash,
	environment: Environment,
}>();
</script>

<template>
	<Head title="Dashboard" />
	<OrgLayout
		:user="user"
		:organization="organization"
		:flash="flash"
		:environment="environment"
		page_title="Dashboard"
		page_subtitle="Welcome to the dashboard"
		:page_breadcrumbs="breadcrumbs">
		<div class="flex flex-col items-center justify-center h-screen">
			<h1 class="text-4xl font-bold">{{ t__('Dashboard') }}</h1>
			<p class="mt-4 text-lg">{{ t__('Welcome to the dashboard') }}</p>
		</div>
	</OrgLayout>
</template>
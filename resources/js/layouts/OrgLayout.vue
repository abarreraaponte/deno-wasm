<script setup lang="ts">
import OrgTopNav from '@/components/navigation/OrgTopNav.vue';
import OrgBottomNav from '@/components/navigation/OrgBottomNav.vue';
import { User, Organization, Flash, Environment, PageBreadcrumb } from '@/types';

defineProps<{
	user: User,
	organization: Organization,
	flash: Flash,
	environment: Environment,
	page_title?: string,
	page_subtitle?: string,
	page_breadcrumbs?: PageBreadcrumb[],
}>();

</script>
<template>
	<OrgTopNav :user="user" :organization="organization" :environment="environment" :page_title="page_title" :page_subtitle="page_subtitle" :page_breadcrumbs="page_breadcrumbs" />
	<main>
		<slot></slot>
	</main>
	<OrgBottomNav :user="user" :organization="organization" :environment="environment" />
</template>
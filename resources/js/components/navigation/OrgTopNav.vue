<script setup lang="ts">
import { User, Organization, Environment, PageBreadcrumb } from '@/types';
import { Menu } from 'lucide-vue-next';
import OrgBreadcrumbs from './OrgBreadcrumbs.vue';

defineProps<{
	user: User,
	organization: Organization,
	environment: Environment,
	page_title?: string,
	page_subtitle?: string,
	page_breadcrumbs?: PageBreadcrumb[],
}>();
</script>
<template>
	<header class="flex justify-between fixed top-0 p-2 font-mono w-full z-10">
		<nav class="flex justify-start gap-4 items-center w-1/3">
			<button class="btn btn-soft btn-primary btn-circle btn-sm" type="button">
				<Menu class="w-4 h-4"></Menu>
			</button>
			<div class="flex flex-col gap-0">
				<span class="text-md font-bold">
					{{ page_title }}
				</span>
				<span class="text-xs font-light">
					{{ page_subtitle }}
				</span>
			</div>
		</nav>
		<nav class="hidden lg:flex lg:gap-2 lg:items-center w-1/3 justify-center">
			<OrgBreadcrumbs v-if="page_breadcrumbs" :page_breadcrumbs="page_breadcrumbs" />
		</nav>
		<nav class="flex justify-end gap-4 items-center w-1/3">
			<div class="flex gap-2">
				<slot name="page_actions"></slot>
			</div>
			<slot name="page_icon"></slot>
		</nav>
	</header>
</template>
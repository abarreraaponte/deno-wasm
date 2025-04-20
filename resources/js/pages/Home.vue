<script setup lang="ts">
import { Organization } from '@/types/index';
import { Head, Link, useForm } from '@inertiajs/vue3';
import GeneralLayout from '@/layouts/GeneralLayout.vue';

defineProps<{
  organizations: Organization[];
  errors: Record<string, string>;
}>();

const newOrganizationForm = useForm({
  name: '',
});

function submitNewOrganization() {
	newOrganizationForm.post('/organizations', {
		onSuccess: () => {
			newOrganizationForm.reset();
		},
		onError: (errors) => {
			console.error(errors);
		},
  	});
}


</script>

<template>
	<Head title="Home" />
	<GeneralLayout>
		<label for="org-creation-drawer" class="drawer-button btn btn-primary">Open drawer</label>
		<ul>
			<li v-for="organization in organizations" :key="organization.id">
				<Link :href="`/web/${organization.id}`">
					{{ organization.name }}
				</Link>
			</li>
		</ul>
		<div class="drawer drawer-end">
			<input id="org-creation-drawer" type="checkbox" class="drawer-toggle" />
			<div class="drawer-side">
				<label for="org-creation-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
				<section class="menu bg-base-200 text-base-content min-h-full w-1/2 p-4">
					<form @submit.prevent="submitNewOrganization">
						<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
							<legend class="fieldset-legend">New Organization</legend>

							<label class="label">Name</label>
							<input type="text" class="input" placeholder="My amazing Organization" v-model="newOrganizationForm.name" />
							<span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>

							<button type="submit" class="btn btn-primary mt-4" :disabled="newOrganizationForm.processing">
								Create Organization
							</button>

						</fieldset>
					</form>
				</section>
			</div>
		</div>
	</GeneralLayout>
</template>
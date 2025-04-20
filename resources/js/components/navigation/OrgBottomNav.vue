<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { CircleUserRound, Store, GitBranch } from 'lucide-vue-next';
import { User, Organization, Environment } from '@/types';

defineProps<{
	user: User,
	organization: Organization,
	environment: Environment,
}>();

</script>
<template>
	<footer class="flex flex-col lg:flex-row bg-base-300 justify-between lg:fixed bottom-0 w-full text-xs font-mono items-center">
		<div class="dropdown dropdown-top">
			<nav tabindex="0" role="button" class="tooltip tooltip-top flex gap-2 py-1 px-2 hover:bg-base-200 cursor-pointer" data-tip="User name and action">
				<CircleUserRound class="w-4 h-4"></CircleUserRound><p>{{ user.name }}</p>
			</nav>
			<ul tabindex="0" class="dropdown-content bg-base-200 menu z-1 w-52 p-0">
				<li><Link href="/profile">Profile</Link></li>
				<li><Link href="/logout">Log out</Link></li>
			</ul>
		</div>

		<nav class="tooltip tooltip-top flex gap-2 py-1 px-2 hover:bg-base-200" data-tip="Org name and environment">
			<Store class="w-4 h-4"></Store> <p>{{ organization.name }} {{ environment.type ? `(${environment.type})` : '' }}</p>
		</nav>

		<nav class="tooltip tooltip-top flex gap-2 py-1 px-2 hover:bg-base-200" data-tip="Version, region and language">
			<GitBranch class="w-4 h-4"></GitBranch>
			<p>
				{{ environment.version ? `(${environment.version})` : '' }}
				{{ environment.region ? `(${environment.region})` : '' }}
				{{ environment.locale ? `(${environment.locale})` : '' }}
			</p>
		</nav>
	</footer>
</template>
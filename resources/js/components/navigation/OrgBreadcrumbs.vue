<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { PageBreadcrumb } from '@/types';
import { ref, computed } from 'vue';

const props = defineProps<{
    page_breadcrumbs: PageBreadcrumb[],
}>();

const showDropdown = ref(false);

const visibleBreadcrumbs = computed(() => {
    const length = props.page_breadcrumbs.length;

    if (length <= 3) {
        return props.page_breadcrumbs;
    } else {
        const first = props.page_breadcrumbs[0];
        const secondToLast = props.page_breadcrumbs[length - 2];
        const last = props.page_breadcrumbs[length - 1];

        return [first, { name: 'middle', href: '#'}, secondToLast, last];
    }
});

const middleBreadcrumbs = computed(() => {
    const length = props.page_breadcrumbs.length;
    if (length > 3) {
        return props.page_breadcrumbs.slice(1, length - 2);
    }
    return [];
});
</script>

<template>
	<div class="dropdown dropdown-bottom dropdown-end">
		<nav class="p-2 text-xs font-mono breadcrumbs">
			<ul>
				<li v-for="(breadcrumb, index) in visibleBreadcrumbs" :key="index">
					<template v-if="breadcrumb.name === 'middle'">
						<label tabindex="0" role="button" class="btn btn-sm btn-ghost">...</label>
					</template>
					<template v-else>
						<Link :href="breadcrumb.href" class="link link-primary">
							{{ breadcrumb.name }}
						</Link>
					</template>
				</li>
			</ul>
		</nav>
		<ul tabindex="0" class="dropdown-content p-0 menu shadow bg-base-200 w-52">
			<li v-for="(middleCrumb, middleIndex) in middleBreadcrumbs" :key="middleIndex">
				<Link :href="middleCrumb.href" class="">
					{{ middleCrumb.name }}
				</Link>
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);

async function callTestJson() {
	const response = await fetch("/api/test-json");
	const data: { count: number; status: string } = await response.json();
	count.value = data.count;
}
</script>

<template>
	<div>
		{{ count }}
		<button type="button" @click="callTestJson()">Call Test JSON</button>
	</div>
</template>



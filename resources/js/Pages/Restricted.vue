<script setup lang="ts">
</script>

<template>
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
			</div>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				<li><a>Item 1</a></li>
				<li>
				<a>Parent</a>
				<ul class="p-2">
					<li><a>Submenu 1</a></li>
					<li><a>Submenu 2</a></li>
				</ul>
				</li>
				<li><a>Item 3</a></li>
			</ul>
			</div>
			<a class="btn btn-ghost text-xl">daisyUI</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
			<li><a>Item 1</a></li>
			<li>
				<details>
				<summary>Parent</summary>
				<ul class="p-2">
					<li><a>Submenu 1</a></li>
					<li><a>Submenu 2</a></li>
				</ul>
				</details>
			</li>
			<li><a>Item 3</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			<a class="btn">Button</a>
		</div>
	</div>
	<ul class="menu bg-base-200 lg:menu-horizontal rounded-box">
		<li>
			<a>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
			</svg>
			Inbox
			<span class="badge badge-xs">99+</span>
			</a>
		</li>
		<li>
			<a>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Updates
			<span class="badge badge-xs badge-warning">NEW</span>
			</a>
		</li>
		<li>
			<a>
			Stats
			<span class="badge badge-xs badge-info"></span>
			</a>
		</li>
	</ul>
</template>
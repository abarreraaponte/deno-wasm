export type Organization = {
	id: string,
	name: string,
	created_at: string,
	updated_at: string,
}

export type User = {
	id: string,
	first_name: string,
	last_name: string,
	name: string,
	email: string,
}

export type Flash = {
	success: string|null,
	error: string|null,
	warning: string|null,
	info: string|null,
}

export type Environment = {
	locale: string|null,
	type: string|null,
	region: string|null,
	version: string|null,
}

export type PageBreadcrumb = {
	name: string,
	href: string,
};
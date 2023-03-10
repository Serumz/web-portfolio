import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageServerLoad = async ({ url }) => {
	const projects_glob = import.meta.glob(`/src/projects/*.{md,svx,svelte.md}`);

	const project_promises = Object.entries(projects_glob).map(([path, resolver]) =>
		resolver().then((project) => ({
			slug: slugFromPath(path),
			...(project as unknown as App.MdsvexFile).metadata
		}))
	);

	let projects = (await Promise.all(project_promises)) as unknown as App.ProjectData[];
	projects = projects.filter((project) => project.published);

	projects.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
	return {
		projects
	};
};

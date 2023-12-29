import { App } from "obsidian";
import { loadFront } from "yaml-front-matter";

const getPageObj = async (app: App) => {
	const currentFile = app.workspace.getActiveFile();
	if (currentFile === null) return null;
	const fileContent: string = await app.vault.read(currentFile);
	const pageObj = loadFront(fileContent);

	return pageObj;
};

export default getPageObj;

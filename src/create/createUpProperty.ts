import { App, TFile } from "obsidian";

const createUpProperty = async (app: App, file: TFile) => {
	const prevFile = app.workspace.getActiveFile()?.basename;
	if (prevFile === undefined) return;
	const content = `---\nup: "[[${prevFile}]]"\n---\n`;

	try {
		await app.vault.modify(file, content);
	} catch (error) {
		console.error(error);
	}
};

export default createUpProperty;

import { Plugin, Notice, TFile, TFolder } from "obsidian";
import makeNotice from "./utils/makeNotice";
import goMultiPage from "./goMultiPage";
import goSinglePage from "./goSinglePage";
import GoUpSettingTab from "./settings/SettingTab";
import createUpProperty from "./create/createUpProperty";
import getPageObj from "./utils/getPageObj";

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	addUpWhenCreated: false,
};

export default class goUp extends Plugin {
	#goPage = this.app.workspace.openLinkText.bind(this.app.workspace);
	#activeNotice: Notice | null = null;
	#timeout = 3000;
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new GoUpSettingTab(this.app, this));
		this.addCommand({
			id: "goUp",
			name: "Go Up",
			callback: this.goUp.bind(this),
			hotkeys: [
				{
					modifiers: ["Meta", "Shift"],
					key: "u",
				},
			],
		});

		this.app.vault.on("create", async (file: TFile) => {
			if (
				file instanceof TFolder ||
				this.settings.addUpWhenCreated === false
			)
				return;
			createUpProperty(this.app, file);
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private switchActiveNotice(notice: Notice | null) {
		this.#activeNotice = notice;
	}

	private alertNoUpperPage() {
		if (this.#activeNotice) return;
		this.#activeNotice = makeNotice(
			"There is No Upper Page",
			this.#timeout
		);
		setTimeout(() => this.switchActiveNotice(null), this.#timeout);
	}

	private async goUp() {
		const pageObj = await getPageObj(this.app);
		if (pageObj === null || pageObj.up === undefined) {
			this.alertNoUpperPage();
			return;
		}

		Array.isArray(pageObj.up)
			? goMultiPage(pageObj.up, this.#goPage, this.app)
			: goSinglePage(pageObj.up, this.#goPage);
	}
}

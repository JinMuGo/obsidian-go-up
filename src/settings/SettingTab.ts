import goUp from "src/main";
import { App, PluginSettingTab, Setting } from "obsidian";

export default class GoUpSettingTab extends PluginSettingTab {
	plugin: goUp;

	constructor(app: App, plugin: goUp) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("addUpWhenCreated")
			.setDesc(
				"this option is append 'up' property when you create new note"
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.addUpWhenCreated)
					.onChange(async (value) => {
						this.plugin.settings.addUpWhenCreated = value;
						await this.plugin.saveSettings();
					});
			});
	}
}

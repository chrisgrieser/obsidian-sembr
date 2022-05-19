import { Plugin, Editor, Notice } from "obsidian";

export default class ObsidianSemBr extends Plugin {

	async onload() {
		console.log("Semantic Line Breaker Plugin loaded.");

		this.addCommand({
			id: "toggle-sem-br",
			name: "Toggle Semantic Line Breaks",
			editorCallback: (editor) => this.toggleSemBr(editor),
		});
	}

	async onunload() { console.log("Semantic Line Breaker Plugin unloaded.") }

	async toggleSemBr (editor: Editor) {
		// read note
		let noticeText;
		let noteContent = editor.getValue();

		// cut out yaml header, if the text has it, to avoid applying SemBr there
		const yamlHeader = noteContent.match(/^---\n.*?---\n/s);
		if (yamlHeader) noteContent = noteContent.replace(yamlHeader[0], "");

		// ensure line break at end of file to recognize last line properly
		if (!noteContent.endsWith("\n")) noteContent += "\n";

		// Toggle SemBr
		const isSemanticLineBreaked = /[.,:;?!—] ?\n(?!\n)/.test(noteContent);
		if (isSemanticLineBreaked) {
			noteContent = noteContent
				.replace (/(\S) ?\n(?!\n)/gm, "$1");
			noticeText = "Semantic Line Breaks removed.";
		}
		else {
			// respecting Markdown two-space-rule & footnotes & dataview inline attributes
			noteContent = noteContent
				.replace (/([^\]:][.,:;?!—](?: ?\[.+\])? )(?!\n\n| )/gm, "$1\n"); // yep, I do like regex, lol
			noticeText = "Semantic Line Breaks applied.";
		}

		// put YAML back
		if (yamlHeader) noteContent = yamlHeader[0] + noteContent;

		// write note
		editor.setValue(noteContent);
		new Notice (noticeText);
	}

}

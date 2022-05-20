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
		let noteContent = editor.getValue();

		// cut out yaml header, if the text has it, to avoid applying SemBr there
		const yamlHeader = noteContent.match(/^---\n.*?---\n/s);
		if (yamlHeader) noteContent = noteContent.replace(yamlHeader[0], "");

		// ensure line break at end of file to recognize last line properly
		noteContent = noteContent.replace(/\n+$/, "");

		// Toggle SemBr
		const isSemanticLineBreaked = /[.,:;?!—] ?\n(?!\n)/.test(noteContent);

		if (isSemanticLineBreaked) {
			noteContent = noteContent
				.replace (/(\S) ?\n(?!\n)/gm, "$1 ");
		} else {
			// respecting Markdown two-space-rule & footnotes & dataview inline attributes
			// the "15" denotes the minimum number of characters
			noteContent = noteContent
				.replace (/([^.,]{15,}?[^\]:][.,:;?!—](?: ?\[.+\])? )(?!\n\n| )/gm, "$1\n"); // yep, I do like regex, lol
		}

		// put YAML back
		if (yamlHeader) noteContent = yamlHeader[0] + noteContent;

		// add line break ad document end back
		noteContent += "\n";

		// write note
		editor.setValue(noteContent);
	}

}

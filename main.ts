import { Plugin, Editor } from "obsidian";

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
				.replace (/([.,:;?!—]) ?\n(?!\n)/gm, "$1 ");
		} else {
			noteContent = noteContent
				.replace (/([^.,]{15,}?[^\]:][.,:;?!—](?: ?\[.+\])? )(?!\n\n| |.*\|.*$)/gm, "$1\n");
			//             (1        )(2   )(3      )(4         )   (5               )
			// 1: 15 chars minimum (non-greedy), all without another , or .  occuring
			// 2: not followed by ]: (footnotes) or :: (dataview inline fields)
			// 3: ending with a punctuation
			// 4: optionally followed by a trailing space or a footnote
			// 5: not followed by two line breaks (blank line),
			//    another space (Markdown Two-Space Rule),
			//    or a Pipe character somewhere till the end of the line (Table)
		}

		// put YAML back
		if (yamlHeader) noteContent = yamlHeader[0] + noteContent;

		// add line break at document end back
		noteContent += "\n";

		// write note
		editor.setValue(noteContent);
	}

}

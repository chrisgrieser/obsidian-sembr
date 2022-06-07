import { Plugin, Editor } from "obsidian";
/* eslint spaced-comment: "off" */

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

	public removeSemBr (str: string) {
		return str.replace (/([.,:;?!—]) ?\n(?!\n)/gm, "$1 ");
	}

	async toggleSemBr (editor: Editor) {
		// read note
		let noteContent = editor.getValue()
			.replace(/\n+$/, ""); // remove line breaks at end of file to recognize last line properly

		// cut out yaml header, if the text has it
		const yamlHeader = noteContent.match(/^---\n.*?---\n/s);
		if (yamlHeader) noteContent = noteContent.replace(yamlHeader[0], "");

		// cut out code blocks (TODO: use a proper tree for that...)
		const noteHasCodeBlock = noteContent.includes("```");
		const codeBlockArr: string[] = [];
		let proseTextArr = [];
		if (noteHasCodeBlock) {
			let i = 0;
			noteContent.split("```").forEach(part => {
				const evenElementIndex = (i % 2) === 0;

				if (evenElementIndex) proseTextArr.push(part);
				else codeBlockArr.push(part);

				i++;
			});
		} else {
			proseTextArr.push(noteContent);
		}

		// TOGGLE SEMBR
		const isSemanticLineBreaked = /[.,:;?!—] ?\n(?!\n)/.test(noteContent);

		proseTextArr = proseTextArr.map(prose => {
			// Remove sembr
			if (isSemanticLineBreaked) return this.removeSemBr(prose);

			// Add sembr
			prose = prose.replace (
				/([^|.]{25,}?[^:][.,:;?!—](?: ?\[.+\])?( ))(?!\n\n| |.*\|.*$|p\. [1-9-]+\]|@|\d)(?=[^|.]{25,})/gm,
				//(1         )(2 )(3      )(4          )(5) (6                )(7              )(8           )
				//(     $1                                 )
				// 1: 20 chars minimum (non-greedy), all without another . occuring
				//    pipes (|), too, aren't allowed (tables)
				// 2: not ending with :: (dataview inline fields)
				// 3: ending with a punctuation as defined in SemBr specification §4-5
				// 4: optionally followed by a footnote like `[^1]`
				// 5: space after punctuation in prose text
				// 6: not followed by two line breaks (blank line),
				//    another space (Markdown Two-Space Rule),
				//    or a pipe character somewhere till the end of the line (Table)
				// 7: also not followed by pandoc citation syntax, so citations aren't
				//    split up
				// 8: followed by at least 20 chars without punctuation
				//    (to prevent too short parts afterwards)

				"$1\n"); // add the line break

			// stitch back footnotes
			prose = prose.replace(
				/\n\[\^.*?(?=\[\n\^|\n\n|$)/gs,
				footnote => this.removeSemBr(footnote)
			);

			return prose;
		});

		// put YAML & code blocks back
		if (noteHasCodeBlock) {
			const tempArr = [];
			for (let i = 0; i < proseTextArr.length; i++) {
				tempArr.push(proseTextArr[i]);
				if (codeBlockArr[i])	tempArr.push(codeBlockArr[i]);
			}
			noteContent = tempArr.join("```");
		} else {
			noteContent = proseTextArr[0];
		}
		if (yamlHeader) noteContent = yamlHeader[0] + noteContent;

		// add line break at document end back
		noteContent += "\n";

		// write note
		editor.setValue(noteContent);
	}

}

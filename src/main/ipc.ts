import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { dialog, ipcMain } from "electron";
import * as pty from "node-pty";

let hashcatProcess: pty.IPty | null = null;

export function setupIPC() {
	ipcMain.handle("dialog:selectDirectory", async () => {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["openDirectory"],
		});
		if (canceled) return null;
		return filePaths[0];
	});

	ipcMain.handle("dialog:selectFile", async () => {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["openFile"],
		});
		if (canceled) return null;
		return filePaths[0];
	});

	ipcMain.handle("fs:readHashcatDir", async (_, dirPath: string) => {
		try {
			const rulesDir = join(dirPath, "rules");
			const rules: string[] = [];
			try {
				const rulesFiles = await readdir(rulesDir, { withFileTypes: true });
				rules.push(
					...rulesFiles
						.filter((f) => f.isFile() && f.name.endsWith(".rule"))
						.map((f) => f.name),
				);
			} catch (_e) {
				// rules dir might not exist
			}

			// Read wordlists from root and 'dictionaries'
			const wordlists: string[] = [];
			const exts = [".txt", ".dict", ".lst"];
			try {
				const rootFiles = await readdir(dirPath, { withFileTypes: true });
				wordlists.push(
					...rootFiles
						.filter((f) => f.isFile() && exts.some((e) => f.name.endsWith(e)))
						.map((f) => f.name),
				);
			} catch (_e) {}

			const dictDir = join(dirPath, "dictionaries");
			try {
				const dictFiles = await readdir(dictDir, { withFileTypes: true });
				wordlists.push(
					...dictFiles
						.filter((f) => f.isFile() && exts.some((e) => f.name.endsWith(e)))
						.map((f) => join("dictionaries", f.name)),
				);
			} catch (_e) {}

			return { rules, wordlists };
		} catch (error) {
			console.error(error);
			return { rules: [], wordlists: [] };
		}
	});

	ipcMain.handle(
		"hashcat:start",
		async (event, dirPath: string, args: string[]) => {
			if (hashcatProcess) {
				try {
					hashcatProcess.kill();
				} catch (_e) {}
			}

			return new Promise((resolve) => {
				const exeName =
					process.platform === "win32" ? "hashcat.exe" : "hashcat";
				const exePath = join(dirPath, exeName);

				hashcatProcess = pty.spawn(exePath, args, {
					name: "xterm-color",
					cols: 120,
					rows: 30,
					cwd: dirPath,
					env: process.env as Record<string, string>,
				});

				hashcatProcess.onData((data) => {
					event.sender.send("hashcat:output", data);
				});

				hashcatProcess.onExit(({ exitCode }) => {
					event.sender.send("hashcat:exit", exitCode);
					hashcatProcess = null;
				});
				resolve(true);
			});
		},
	);

	ipcMain.handle("hashcat:stop", () => {
		if (hashcatProcess) {
			try {
				hashcatProcess.kill();
			} catch (_e) {}
			hashcatProcess = null;
			return true;
		}
		return false;
	});

	ipcMain.handle("hashcat:write", (_, input: string) => {
		if (hashcatProcess) {
			try {
				hashcatProcess.write(input);
				return true;
			} catch (_e) {
				return false;
			}
		}
		return false;
	});
}

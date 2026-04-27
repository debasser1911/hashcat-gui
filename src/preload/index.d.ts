import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			selectDirectory: () => Promise<string | null>;
			selectFile: () => Promise<string | null>;
			readHashcatDir: (
				dirPath: string,
			) => Promise<{ rules: string[]; wordlists: string[] }>;
			startHashcat: (dirPath: string, args: string[]) => Promise<boolean>;
			stopHashcat: () => Promise<boolean>;
			writeHashcat: (input: string) => Promise<boolean>;
			onHashcatOutput: (callback: (data: string) => void) => () => void;
			onHashcatError: (callback: (data: string) => void) => () => void;
			onHashcatExit: (callback: (code: number | null) => void) => () => void;
		};
	}
}

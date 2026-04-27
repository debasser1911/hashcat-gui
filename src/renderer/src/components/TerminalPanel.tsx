import type React from "react";
import { LogLine } from "./LogLine";

type TerminalPanelProps = {
	consoleOutput: string[];
	lastCommand: string;
	autoScroll: boolean;
	setAutoScroll: (val: boolean) => void;
	consoleRef: React.RefObject<HTMLDivElement | null>;
	clearConsole: () => void;
	sendCommand: (cmd: string) => void;
	isRunning: boolean;
	handleStart: () => void;
};

export const TerminalPanel = ({
	consoleOutput,
	lastCommand,
	autoScroll,
	setAutoScroll,
	consoleRef,
	clearConsole,
	sendCommand,
	isRunning,
	handleStart,
}: TerminalPanelProps) => {
	return (
		<div className="panel console-panel">
			<div className="terminal-header">
				<h2>Terminal</h2>
				<div className="live-update-toggle">
					<input
						type="checkbox"
						id="autoScroll"
						checked={autoScroll}
						onChange={(e) => setAutoScroll(e.target.checked)}
					/>
					<label htmlFor="autoScroll">Live update (Auto-scroll)</label>
				</div>
			</div>

			{lastCommand && (
				<div className="terminal-command-display">
					<strong>&gt; </strong> {lastCommand}
				</div>
			)}

			<div className="console-output flex-col" ref={consoleRef}>
				{consoleOutput.length === 0 ? (
					<div>Ready to crack...</div>
				) : (
					consoleOutput.map((line) => <LogLine key={line} text={line} />)
				)}
			</div>

			<div className="console-actions">
				<div className="action-buttons-group">
					<button className="btn-outline" onClick={clearConsole} type="button">
						Clear
					</button>
					{isRunning && (
						<>
							<button
								className="btn-secondary"
								onClick={() => sendCommand("s")}
								type="button"
							>
								Status (s)
							</button>
							<button
								className="btn-secondary"
								onClick={() => sendCommand("p")}
								type="button"
							>
								Pause (p)
							</button>
							<button
								className="btn-secondary"
								onClick={() => sendCommand("r")}
								type="button"
							>
								Resume (r)
							</button>
							<button
								className="btn-secondary"
								onClick={() => sendCommand("b")}
								type="button"
							>
								Bypass (b)
							</button>
							<button
								className="btn-secondary"
								onClick={() => sendCommand("c")}
								type="button"
							>
								Checkpoint (c)
							</button>
						</>
					)}
				</div>
				<div className="main-actions-group">
					{!isRunning ? (
						<button onClick={handleStart} type="button">
							Start Attack
						</button>
					) : (
						<button
							className="danger"
							onClick={() => sendCommand("q")}
							type="button"
						>
							Quit (q)
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

import type React from "react";
import { useState } from "react";

type VersionsProps = {
	isOpen: boolean;
	onClose: () => void;
};

function Versions({
	isOpen,
	onClose,
}: VersionsProps): React.JSX.Element | null {
	const [versions] = useState(window.electron.process.versions);

	if (!isOpen) return null;

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: Overlay handles background clicks
		// biome-ignore lint/a11y/noStaticElementInteractions: Overlay handles background clicks
		<div className="modal-overlay" onClick={onClose}>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: Prevent event bubbling */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: Prevent event bubbling */}
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<h2>About Hashcat GUI</h2>
				<p>
					A modern, interactive GUI wrapper for the Hashcat password recovery
					tool.
				</p>

				<div className="version-info">
					<strong>System Information:</strong>
					<ul>
						<li>Electron v{versions.electron}</li>
						<li>Chromium v{versions.chrome}</li>
						<li>Node v{versions.node}</li>
					</ul>
				</div>

				<div className="copyright">
					<p>
						&copy; {new Date().getFullYear()} Hashcat GUI powered by Electron &
						React
					</p>
					<p>Created by debasser1911.</p>
				</div>

				<button
					type="button"
					className="btn-secondary"
					style={{ marginTop: "16px", width: "100%" }}
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
}

export default Versions;

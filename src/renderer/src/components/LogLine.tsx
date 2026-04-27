import { useMemo } from "react";

export const LogLine = ({ text }: { text: string }) => {
	// Split chunk by lines and generate stable IDs to avoid array index key warnings
	const lines = useMemo(() => {
		return text.split("\n").map((line) => ({
			id: crypto.randomUUID(),
			content: line,
		}));
	}, [text]);

	return (
		<>
			{lines.map(({ id, content }) => {
				if (!content) return <span key={id} />;

				if (
					content.includes("[ERROR]") ||
					content.includes("Failed to") ||
					content.includes("Exhausted")
				) {
					return (
						<div key={id} style={{ color: "#ff5555" }}>
							{content}
						</div>
					);
				}
				if (content.includes("Status...........:")) {
					const isCracked = content.includes("Cracked");
					return (
						<div key={id}>
							<span style={{ color: "var(--text-main)" }}>
								Status...........:{" "}
							</span>
							<span
								style={{
									color: isCracked ? "#50fa7b" : "#8be9fd",
									fontWeight: isCracked ? "bold" : "normal",
								}}
							>
								{content.split("Status...........:")[1]}
							</span>
						</div>
					);
				}
				if (content.includes("Progress.........:")) {
					return (
						<div key={id}>
							<span style={{ color: "var(--text-main)" }}>
								Progress.........:{" "}
							</span>
							<span style={{ color: "#f1fa8c" }}>
								{content.split("Progress.........:")[1]}
							</span>
						</div>
					);
				}
				if (content.includes("Speed.#")) {
					const parts = content.split(":");
					return (
						<div key={id}>
							<span style={{ color: "var(--text-main)" }}>{parts[0]}: </span>
							<span style={{ color: "#ffb86c" }}>
								{parts.slice(1).join(":")}
							</span>
						</div>
					);
				}
				if (content.includes("Time.Estimated...:")) {
					return (
						<div key={id}>
							<span style={{ color: "var(--text-main)" }}>
								Time.Estimated...:{" "}
							</span>
							<span style={{ color: "#bd93f9" }}>
								{content.split("Time.Estimated...:")[1]}
							</span>
						</div>
					);
				}
				if (content.includes("Recovered........:")) {
					return (
						<div key={id}>
							<span style={{ color: "var(--text-main)" }}>
								Recovered........:{" "}
							</span>
							<span style={{ color: "#50fa7b", fontWeight: "bold" }}>
								{content.split("Recovered........:")[1]}
							</span>
						</div>
					);
				}
				if (content.includes("INFO: All hashes found as potfile")) {
					return (
						<div key={id} style={{ color: "#50fa7b", fontWeight: "bold" }}>
							{content}
						</div>
					);
				}
				if (content.includes("Started: ") || content.includes("Stopped: ")) {
					return (
						<div key={id} style={{ color: "#6272a4" }}>
							{content}
						</div>
					);
				}

				return <div key={id}>{content}</div>;
			})}
		</>
	);
};

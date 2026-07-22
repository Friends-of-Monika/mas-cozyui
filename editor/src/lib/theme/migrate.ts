/**
 * Versioning for the .cozy project config. Every config the editor writes
 * carries a "version"; files written before versioning existed have none and
 * are treated as v1.
 *
 * To add a format change: bump CONFIG_VERSION and add the matching step to
 * `migrations`, keyed by the version it upgrades *from*.
 */
export const CONFIG_VERSION = 2;

/** A config as read from disk, before it is trusted to match ThemeConfig. */
export type RawConfig = Record<string, unknown>;

const migrations: Record<number, (config: RawConfig) => RawConfig> = {
	// v1 -> v2: individual derived colors can be pinned to an absolute value,
	// overriding the primary/secondary modulation. v1 projects pinned nothing.
	1: (config) => ({ ...config, color_overrides: {} })
};

/** Reads the declared format version, defaulting to the pre-versioning v1. */
export function configVersion(raw: RawConfig): number {
	return typeof raw.version === "number" ? raw.version : 1;
}

/**
 * Brings a config read from a .cozy file up to CONFIG_VERSION, applying each
 * migration step in turn. Throws when the file is newer than this build knows
 * how to read, rather than silently dropping the fields it doesn't understand.
 */
export function migrateConfig(raw: RawConfig): RawConfig {
	let version = configVersion(raw);

	if (version > CONFIG_VERSION) {
		throw new Error(
			`This project was saved by a newer version of the editor ` +
				`(format v${version}; this build reads up to v${CONFIG_VERSION}).`
		);
	}

	let config = raw;
	while (version < CONFIG_VERSION) {
		const step = migrations[version];
		if (!step) throw new Error(`No migration from .cozy format v${version} to v${version + 1}.`);
		config = step(config);
		version++;
	}

	return { ...config, version: CONFIG_VERSION };
}

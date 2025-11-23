export interface ArtData {
	title: string;
	artist: string;
	url: string;
}

export type Result<T, E> =
	| { ok: true; value: T }
	| { ok: false; error: E };

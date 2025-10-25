
export async function generateMusicMP3(prompt: string): Promise<any> {
	const res = await fetch('https://api.elevenlabs.io/v1/music', {
		method: 'POST',
		headers: {
			'xi-api-key': process.env.ELEVENLABS_API_KEY!,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ prompt }),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`ElevenLabs API error ${res.status}: ${text}`);
	}

    const resp = await res.json();

	return resp;
}

export default generateMusicMP3;

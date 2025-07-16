export function objectToFormData<
	T extends Record<
		string,
		string | number | boolean | File | object | null | undefined
	>
>(obj: T): FormData {
	const formData = new FormData();

	Object.entries(obj).forEach(([key, value]) => {
		if (value !== null && value !== undefined) {
			if (value instanceof File) {
				formData.append(key, value);
			} else if (typeof value === "object") {
				formData.append(key, JSON.stringify(value));
			} else {
				if (String(value) !== "") {
					formData.append(key, String(value));
				}
			}
		}
	});

	return formData;
}

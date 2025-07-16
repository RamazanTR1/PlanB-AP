interface BackendFieldError {
	field: string;
	message: string;
}

export interface BackendError {
	status: number;
	message: string;
	errors?: BackendFieldError[];
}

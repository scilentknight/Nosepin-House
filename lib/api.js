import { NextResponse } from "next/server";
import { ApiError } from "@/lib/session";
export function ok(data, message = "") {
    return NextResponse.json({ success: true, message, data });
}
export function fail(status, message) {
    return NextResponse.json({ success: false, message, data: null }, { status });
}
export function handleApiError(error) {
    if (error instanceof ApiError) {
        return fail(error.status, error.message);
    }
    console.error(error);
    return fail(500, "Something went wrong");
}

namespace Vns.PickleTrack.Application.Common;

public sealed record ApiError(string Code, string? Field, string Message);

public sealed record ApiEnvelope<T>(
    bool Success,
    T? Data,
    string Message,
    IReadOnlyCollection<ApiError> Errors)
{
    public static ApiEnvelope<T> Ok(T data, string message = "")
    {
        return new ApiEnvelope<T>(true, data, message, []);
    }

    public static ApiEnvelope<T> Fail(string message, params ApiError[] errors)
    {
        return new ApiEnvelope<T>(false, default, message, errors);
    }
}
